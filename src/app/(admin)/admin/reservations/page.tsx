'use client';

import { useState, useEffect } from 'react';
import {
  Filter,
  Eye,
  RotateCcw,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';
import { updateReservationStatus } from '@/lib/supabase-db';

// ── Types ────────────────────────────────────────────────────────────────────

interface ReservationRow {
  id: string;
  reservation_number: string;
  total_amount: number;
  deposit_amount: number;
  remaining_amount: number;
  status: string;
  created_at: string;
  // Joined data
  customer_name: string;
  customer_phone: string;
  driver_name: string;
  driver_phone: string;
  route: string;
  vehicle_type: string;
  passengers: number;
  trip_date: string;
}

const statusLabels: Record<string, string> = {
  'pending_payment': '결제대기',
  'deposit_paid': '예약금결제',
  'confirmed': '확정',
  'in_progress': '운행중',
  'completed': '운행완료',
  'cancelled': '취소',
  'refunded': '환불완료',
};

const statusVariants: Record<string, 'info' | 'warning' | 'success' | 'default' | 'danger'> = {
  'pending_payment': 'warning',
  'deposit_paid': 'info',
  'confirmed': 'info',
  'in_progress': 'info',
  'completed': 'success',
  'cancelled': 'danger',
  'refunded': 'default',
};

const paymentStatusLabel = (deposit: number, remaining: number, total: number, status: string) => {
  if (status === 'refunded' || status === 'cancelled') return { deposit: '환불', balance: '환불' };
  if (deposit > 0 && remaining <= 0) return { deposit: '완료', balance: '완료' };
  if (deposit > 0) return { deposit: '완료', balance: '대기' };
  return { deposit: '대기', balance: '대기' };
};

const paymentBadgeVariant = (label: string): 'success' | 'warning' | 'default' => {
  if (label === '완료') return 'success';
  if (label === '대기') return 'warning';
  return 'default';
};

const statusFilterOptions = [
  { value: '', label: '전체 상태' },
  { value: 'pending_payment', label: '결제대기' },
  { value: 'deposit_paid', label: '예약금결제' },
  { value: 'confirmed', label: '확정' },
  { value: 'in_progress', label: '운행중' },
  { value: 'completed', label: '운행완료' },
  { value: 'cancelled', label: '취소' },
  { value: 'refunded', label: '환불완료' },
];

const statusChangeOptions = [
  { value: 'confirmed', label: '확정' },
  { value: 'in_progress', label: '운행중' },
  { value: 'completed', label: '운행완료' },
  { value: 'cancelled', label: '취소' },
  { value: 'refunded', label: '환불완료' },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function ReservationsPage() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<ReservationRow | null>(null);
  const [statusChangeOpen, setStatusChangeOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          quotes(*, quote_requests(departure_address, destination_address, vehicle_type, passenger_count, departure_datetime), vehicles(vehicle_name, vehicle_type)),
          profiles!customer_id(name, phone),
          drivers!driver_id(*, profiles!user_id(name, phone))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: ReservationRow[] = (data ?? []).map((r: any) => {
        const qr = r.quotes?.quote_requests;
        return {
          id: r.id,
          reservation_number: r.reservation_number || r.id.slice(0, 8),
          total_amount: r.total_amount || 0,
          deposit_amount: r.deposit_amount || 0,
          remaining_amount: r.remaining_amount || 0,
          status: r.status,
          created_at: r.created_at,
          customer_name: r.profiles?.name || '-',
          customer_phone: r.profiles?.phone || '-',
          driver_name: r.drivers?.profiles?.name || '-',
          driver_phone: r.drivers?.profiles?.phone || '-',
          route: qr
            ? (qr.departure_address?.split(' ').slice(0, 2).join(' ') || '') +
              ' \u2192 ' +
              (qr.destination_address?.split(' ').slice(0, 2).join(' ') || '')
            : '-',
          vehicle_type: r.quotes?.vehicles?.vehicle_name || r.quotes?.vehicles?.vehicle_type || '-',
          passengers: qr?.passenger_count || 0,
          trip_date: qr?.departure_datetime
            ? new Date(qr.departure_datetime).toLocaleDateString('ko-KR')
            : '-',
        };
      });

      setReservations(mapped);
    } catch (err) {
      console.error('Reservations fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    return true;
  });

  const formatCurrency = (amount: number) =>
    '\u20A9' + amount.toLocaleString('ko-KR');

  const openDetail = (res: ReservationRow) => {
    setSelectedRes(res);
    setDetailOpen(true);
  };

  const openStatusChange = (res: ReservationRow) => {
    setSelectedRes(res);
    setNewStatus(res.status);
    setStatusChangeOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedRes) return;
    setUpdating(true);
    try {
      await updateReservationStatus(selectedRes.id, newStatus);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === selectedRes.id ? { ...r, status: newStatus } : r
        )
      );
      setStatusChangeOpen(false);
    } catch (err) {
      console.error('Status change error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelRefund = async (resId: string) => {
    setUpdating(true);
    try {
      await updateReservationStatus(resId, 'refunded');
      setReservations((prev) =>
        prev.map((r) =>
          r.id === resId ? { ...r, status: 'refunded' } : r
        )
      );
    } catch (err) {
      console.error('Refund error:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
        <p className="mt-1 text-sm text-gray-500">예약 현황과 결제 상태를 관리합니다.</p>
      </div>

      {/* Filter */}
      <Card padding="md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4" />
            필터
          </div>
          <div className="w-full sm:w-40">
            <Select
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">예약번호</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">고객명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">기사명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">노선</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">금액</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">예약금</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">잔금</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">예약상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReservations.map((r) => {
                const ps = paymentStatusLabel(r.deposit_amount, r.remaining_amount, r.total_amount, r.status);
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{r.reservation_number}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{r.customer_name}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{r.driver_name}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{r.route}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(r.total_amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge variant={paymentBadgeVariant(ps.deposit)} size="sm">
                        {ps.deposit}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge variant={paymentBadgeVariant(ps.balance)} size="sm">
                        {ps.balance}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge
                        variant={statusVariants[r.status] || 'default'}
                        size="sm"
                        dot
                      >
                        {statusLabels[r.status] || r.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openDetail(r)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openStatusChange(r)}>
                          <ChevronDown className="h-3.5 w-3.5" />
                          상태변경
                        </Button>
                        {r.status === 'cancelled' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleCancelRefund(r.id)}
                            disabled={updating}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            환불
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                    <Calendar className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={`예약 상세 - ${selectedRes?.reservation_number || ''}`}
        size="lg"
      >
        {selectedRes && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-400">고객 정보</p>
                <p className="mt-1 font-medium text-gray-900">{selectedRes.customer_name}</p>
                <p className="text-sm text-gray-500">{selectedRes.customer_phone}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-400">기사 정보</p>
                <p className="mt-1 font-medium text-gray-900">{selectedRes.driver_name}</p>
                <p className="text-sm text-gray-500">{selectedRes.driver_phone}</p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 px-4 py-3">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <span className="text-gray-400">노선</span>
                  <p className="font-medium text-gray-900">{selectedRes.route}</p>
                </div>
                <div>
                  <span className="text-gray-400">차량</span>
                  <p className="font-medium text-gray-900">{selectedRes.vehicle_type}</p>
                </div>
                <div>
                  <span className="text-gray-400">인원</span>
                  <p className="font-medium text-gray-900">{selectedRes.passengers}명</p>
                </div>
                <div>
                  <span className="text-gray-400">운행일</span>
                  <p className="font-medium text-gray-900">{selectedRes.trip_date}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-blue-50 px-4 py-3 text-center">
                <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedRes.total_amount)}</p>
                <p className="text-xs text-blue-500">총 금액</p>
              </div>
              <div className="rounded-lg bg-green-50 px-4 py-3 text-center">
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(selectedRes.deposit_amount)}
                </p>
                <p className="text-xs text-green-500">예약금</p>
              </div>
              <div className="rounded-lg bg-purple-50 px-4 py-3 text-center">
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(selectedRes.remaining_amount)}
                </p>
                <p className="text-xs text-purple-500">잔금</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Change Modal */}
      <Modal
        open={statusChangeOpen}
        onClose={() => setStatusChangeOpen(false)}
        title="예약 상태 변경"
        footer={
          <>
            <Button variant="outline" onClick={() => setStatusChangeOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleStatusChange} disabled={updating}>
              변경
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            예약번호 <span className="font-semibold">{selectedRes?.reservation_number}</span>의 상태를 변경합니다.
          </p>
          <Select
            label="변경할 상태"
            options={statusChangeOptions}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
