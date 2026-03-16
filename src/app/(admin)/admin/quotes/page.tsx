'use client';

import { useState, useEffect } from 'react';
import {
  Filter,
  Eye,
  CheckCircle2,
  FileText,
  MapPin,
  Users,
  Bus,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';
import { getQuotesForRequest } from '@/lib/supabase-db';

// ── Types ────────────────────────────────────────────────────────────────

interface SubmittedQuote {
  driver: string;
  company: string;
  price: number;
  rating: number;
  vehicle: string;
}

interface QuoteRequestRow {
  id: string;
  request_number: string;
  customer_id: string;
  departure_address: string;
  destination_address: string;
  vehicle_type: string[];
  passenger_count: number;
  quote_count: number;
  status: string;
  created_at: string;
  departure_datetime: string;
  trip_type: string;
  purpose: string;
  special_requests: string | null;
  contact_phone: string;
  profiles: { name: string; phone: string; email?: string } | null;
}

interface QuoteDetail extends QuoteRequestRow {
  submittedQuotes: SubmittedQuote[];
}

const statusConfig: Record<string, { variant: 'info' | 'warning' | 'success' | 'default' | 'danger'; label: string }> = {
  'open': { variant: 'warning', label: '대기' },
  'in_progress': { variant: 'info', label: '견적접수' },
  'reserved': { variant: 'success', label: '예약확정' },
  'expired': { variant: 'default', label: '만료' },
  'cancelled': { variant: 'danger', label: '취소' },
  'completed': { variant: 'success', label: '완료' },
};

const statusOptions = [
  { value: '', label: '전체 상태' },
  { value: 'open', label: '대기' },
  { value: 'in_progress', label: '견적접수' },
  { value: 'reserved', label: '예약확정' },
  { value: 'expired', label: '만료' },
  { value: 'cancelled', label: '취소' },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function QuotesPage() {
  const [loading, setLoading] = useState(true);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestRow[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchQuoteRequests();
  }, []);

  async function fetchQuoteRequests() {
    setLoading(true);
    try {
      let query = supabase
        .from('quote_requests')
        .select('*, profiles!customer_id(name, phone, email)')
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setQuoteRequests((data as QuoteRequestRow[]) ?? []);
    } catch (err) {
      console.error('Quote requests fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredQuotes = quoteRequests.filter((q) => {
    if (statusFilter && q.status !== statusFilter) return false;
    if (dateFrom && q.created_at < dateFrom) return false;
    if (dateTo && q.created_at > dateTo + 'T23:59:59') return false;
    return true;
  });

  const openDetail = async (quote: QuoteRequestRow) => {
    setLoadingDetail(true);
    setDetailOpen(true);

    // Fetch submitted quotes for this request
    let submittedQuotes: SubmittedQuote[] = [];
    try {
      const { data: quotesData } = await getQuotesForRequest(quote.id);
      if (quotesData) {
        submittedQuotes = quotesData.map((sq: any) => ({
          driver: sq.drivers?.profiles?.name || '-',
          company: sq.drivers?.company_name || '-',
          price: sq.total_price || 0,
          rating: sq.drivers?.rating || 0,
          vehicle: sq.vehicles?.vehicle_name || sq.vehicles?.vehicle_type || '-',
        }));
      }
    } catch (err) {
      console.error('Quotes detail fetch error:', err);
    }

    setSelectedQuote({ ...quote, submittedQuotes });
    setLoadingDetail(false);
  };

  const formatCurrency = (amount: number) =>
    '\u20A9' + amount.toLocaleString('ko-KR');

  const tripTypeLabel: Record<string, string> = {
    'one_way': '편도',
    'round': '왕복',
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
        <h1 className="text-2xl font-bold text-gray-900">견적 관리</h1>
        <p className="mt-1 text-sm text-gray-500">모든 견적 요청과 진행 상태를 관리합니다.</p>
      </div>

      {/* Filter Bar */}
      <Card padding="md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4" />
            필터
          </div>
          <div className="w-full sm:w-40">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="상태 선택"
            />
          </div>
          <div className="w-full sm:w-48">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <span className="text-sm text-gray-400">~</span>
          <div className="w-full sm:w-48">
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
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
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">요청번호</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">고객명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">노선</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">차량타입</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">인원</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">견적수</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">요청일</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredQuotes.map((q) => {
                const dep = q.departure_address?.split(' ').slice(0, 2).join(' ') || '';
                const dest = q.destination_address?.split(' ').slice(0, 2).join(' ') || '';
                const route = dep + ' \u2192 ' + dest;
                const badge = statusConfig[q.status] ?? { variant: 'default' as const, label: q.status };

                return (
                  <tr
                    key={q.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openDetail(q)}
                  >
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">
                      {q.request_number || q.id.slice(0, 8)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                      {(q.profiles as any)?.name || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{route}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                      {(q.vehicle_type ?? []).join(', ') || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.passenger_count}명</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.quote_count ?? 0}건</td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge variant={badge.variant} size="sm" dot>
                        {badge.label}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-500">
                      {new Date(q.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(q);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        상세
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                    <FileText className="mx-auto mb-2 h-8 w-8" />
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
        title={`견적 상세 - ${selectedQuote?.request_number || ''}`}
        size="lg"
      >
        {loadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : selectedQuote ? (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Request Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">요청 정보</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-gray-400" />
                  {(selectedQuote.profiles as any)?.name || '-'} ({selectedQuote.contact_phone || '-'})
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {selectedQuote.departure_address} &rarr; {selectedQuote.destination_address}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bus className="h-4 w-4 text-gray-400" />
                  {(selectedQuote.vehicle_type ?? []).join(', ')} / {selectedQuote.passenger_count}명 / {tripTypeLabel[selectedQuote.trip_type] || selectedQuote.trip_type}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  운행일: {selectedQuote.departure_datetime ? new Date(selectedQuote.departure_datetime).toLocaleDateString('ko-KR') : '-'}
                </div>
              </div>
              {selectedQuote.purpose && (
                <p className="mt-2 text-sm text-gray-500">목적: {selectedQuote.purpose}</p>
              )}
              {selectedQuote.special_requests && (
                <p className="mt-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
                  참고: {selectedQuote.special_requests}
                </p>
              )}
            </div>

            {/* Submitted Quotes */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">
                제출된 견적 ({selectedQuote.submittedQuotes.length}건)
              </h3>
              {selectedQuote.submittedQuotes.length === 0 ? (
                <p className="text-sm text-gray-400">아직 제출된 견적이 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {selectedQuote.submittedQuotes.map((sq, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {sq.driver} <span className="text-gray-400">({sq.company})</span>
                        </p>
                        <p className="text-xs text-gray-500">{sq.vehicle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(sq.price)}</p>
                        <p className="text-xs text-gray-400">평점 {sq.rating.toFixed(1)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
