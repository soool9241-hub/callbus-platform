'use client';

import { useState } from 'react';
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

// ── Types ────────────────────────────────────────────────────────────────────

type ReservationStatus = '확정' | '운행완료' | '취소요청' | '취소완료';
type PaymentStatus = '완료' | '대기' | '환불';

interface Reservation {
  id: string;
  customer: string;
  customerPhone: string;
  driver: string;
  driverPhone: string;
  route: string;
  amount: number;
  depositStatus: PaymentStatus;
  balanceStatus: PaymentStatus;
  reservationStatus: ReservationStatus;
  tripDate: string;
  reservedAt: string;
  vehicleType: string;
  passengers: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockReservations: Reservation[] = [
  {
    id: 'R-2026-0201',
    customer: '박민수',
    customerPhone: '010-3456-7890',
    driver: '윤서현',
    driverPhone: '010-5555-6666',
    route: '서울 종로 → 전주',
    amount: 720000,
    depositStatus: '완료',
    balanceStatus: '대기',
    reservationStatus: '확정',
    tripDate: '2026-04-12',
    reservedAt: '2026-03-16',
    vehicleType: '45인승 대형',
    passengers: 38,
  },
  {
    id: 'R-2026-0198',
    customer: '김철수',
    customerPhone: '010-1234-5678',
    driver: '한승우',
    driverPhone: '010-1111-2222',
    route: '서울 강남 → 부산 해운대',
    amount: 850000,
    depositStatus: '완료',
    balanceStatus: '완료',
    reservationStatus: '운행완료',
    tripDate: '2026-03-10',
    reservedAt: '2026-03-05',
    vehicleType: '45인승 대형',
    passengers: 40,
  },
  {
    id: 'R-2026-0195',
    customer: '이영희',
    customerPhone: '010-2345-6789',
    driver: '오지훈',
    driverPhone: '010-3333-4444',
    route: '인천공항 → 강릉',
    amount: 580000,
    depositStatus: '완료',
    balanceStatus: '대기',
    reservationStatus: '취소요청',
    tripDate: '2026-03-28',
    reservedAt: '2026-03-14',
    vehicleType: '28인승 중형',
    passengers: 25,
  },
];

const reservationStatusConfig: Record<
  ReservationStatus,
  { variant: 'info' | 'warning' | 'success' | 'default' | 'danger'; label: string }
> = {
  '확정': { variant: 'info', label: '확정' },
  '운행완료': { variant: 'success', label: '운행완료' },
  '취소요청': { variant: 'danger', label: '취소요청' },
  '취소완료': { variant: 'default', label: '취소완료' },
};

const paymentStatusConfig: Record<PaymentStatus, { variant: 'success' | 'warning' | 'default' }> = {
  '완료': { variant: 'success' },
  '대기': { variant: 'warning' },
  '환불': { variant: 'default' },
};

const statusFilterOptions = [
  { value: '', label: '전체 상태' },
  { value: '확정', label: '확정' },
  { value: '운행완료', label: '운행완료' },
  { value: '취소요청', label: '취소요청' },
  { value: '취소완료', label: '취소완료' },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function ReservationsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [statusChangeOpen, setStatusChangeOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const filteredReservations = reservations.filter((r) => {
    if (statusFilter && r.reservationStatus !== statusFilter) return false;
    return true;
  });

  const formatCurrency = (amount: number) =>
    '\u20A9' + amount.toLocaleString('ko-KR');

  const openDetail = (res: Reservation) => {
    setSelectedRes(res);
    setDetailOpen(true);
  };

  const openStatusChange = (res: Reservation) => {
    setSelectedRes(res);
    setNewStatus(res.reservationStatus);
    setStatusChangeOpen(true);
  };

  const handleStatusChange = () => {
    if (!selectedRes) return;
    setReservations((prev) =>
      prev.map((r) =>
        r.id === selectedRes.id ? { ...r, reservationStatus: newStatus as ReservationStatus } : r
      )
    );
    setStatusChangeOpen(false);
  };

  const handleCancelRefund = (resId: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === resId
          ? { ...r, reservationStatus: '취소완료' as ReservationStatus, balanceStatus: '환불' as PaymentStatus, depositStatus: '환불' as PaymentStatus }
          : r
      )
    );
  };

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
          <div className="w-full sm:w-48">
            <Input type="date" />
          </div>
          <span className="text-sm text-gray-400">~</span>
          <div className="w-full sm:w-48">
            <Input type="date" />
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
              {filteredReservations.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{r.id}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{r.customer}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{r.driver}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{r.route}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(r.amount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <Badge variant={paymentStatusConfig[r.depositStatus]?.variant || 'default'} size="sm">
                      {r.depositStatus}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <Badge variant={paymentStatusConfig[r.balanceStatus]?.variant || 'default'} size="sm">
                      {r.balanceStatus}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <Badge
                      variant={reservationStatusConfig[r.reservationStatus]?.variant || 'default'}
                      size="sm"
                      dot
                    >
                      {reservationStatusConfig[r.reservationStatus]?.label || r.reservationStatus}
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
                      {r.reservationStatus === '취소요청' && (
                        <Button size="sm" variant="danger" onClick={() => handleCancelRefund(r.id)}>
                          <RotateCcw className="h-3.5 w-3.5" />
                          환불
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                    <Calendar className="mx-auto mb-2 h-8 w-8" />
                    해당 조건의 예약이 없습니다.
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
        title={`예약 상세 - ${selectedRes?.id || ''}`}
        size="lg"
      >
        {selectedRes && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-400">고객 정보</p>
                <p className="mt-1 font-medium text-gray-900">{selectedRes.customer}</p>
                <p className="text-sm text-gray-500">{selectedRes.customerPhone}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-400">기사 정보</p>
                <p className="mt-1 font-medium text-gray-900">{selectedRes.driver}</p>
                <p className="text-sm text-gray-500">{selectedRes.driverPhone}</p>
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
                  <p className="font-medium text-gray-900">{selectedRes.vehicleType}</p>
                </div>
                <div>
                  <span className="text-gray-400">인원</span>
                  <p className="font-medium text-gray-900">{selectedRes.passengers}명</p>
                </div>
                <div>
                  <span className="text-gray-400">운행일</span>
                  <p className="font-medium text-gray-900">{selectedRes.tripDate}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-blue-50 px-4 py-3 text-center">
                <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedRes.amount)}</p>
                <p className="text-xs text-blue-500">총 금액</p>
              </div>
              <div className="rounded-lg bg-green-50 px-4 py-3 text-center">
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(Math.round(selectedRes.amount * 0.3))}
                </p>
                <p className="text-xs text-green-500">예약금 (30%)</p>
              </div>
              <div className="rounded-lg bg-purple-50 px-4 py-3 text-center">
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(Math.round(selectedRes.amount * 0.7))}
                </p>
                <p className="text-xs text-purple-500">잔금 (70%)</p>
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
            <Button variant="primary" onClick={handleStatusChange}>
              변경
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            예약번호 <span className="font-semibold">{selectedRes?.id}</span>의 상태를 변경합니다.
          </p>
          <Select
            label="변경할 상태"
            options={[
              { value: '확정', label: '확정' },
              { value: '운행완료', label: '운행완료' },
              { value: '취소요청', label: '취소요청' },
              { value: '취소완료', label: '취소완료' },
            ]}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
