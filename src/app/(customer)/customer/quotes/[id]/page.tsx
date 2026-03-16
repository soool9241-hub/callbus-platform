'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  mockQuoteRequests,
  mockQuotes,
  mockDrivers,
  mockVehicles,
} from '@/lib/mock-data';
import { VEHICLE_TYPES } from '@/types';
import type { QuoteRequest, Quote } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { getQuoteRequestById, getQuotesForRequest, createReservation, updateQuoteStatus, updateQuoteRequestStatus } from '@/lib/supabase-db';
import toast from 'react-hot-toast';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Bus,
  ArrowRight,
  SortAsc,
  MessageCircle,
  CheckCircle,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

type SortOption = 'price' | 'rating' | 'latest';

const driverNames: Record<string, string> = {
  'driver-001': '박정훈',
  'driver-002': '최영호',
};

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

function getVehicleLabel(key: string): string {
  return VEHICLE_TYPES.find((v) => v.key === key)?.label || key;
}

export default function QuoteComparisonPage() {
  const params = useParams();
  const requestId = params.id as string;
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { currentUser } = useStore();

  const [request, setRequest] = useState<QuoteRequest | null | undefined>(undefined);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function fetchData() {
      if (isLoggedIn) {
        try {
          const [reqResult, quotesResult] = await Promise.all([
            getQuoteRequestById(requestId),
            getQuotesForRequest(requestId),
          ]);
          if (reqResult.error) throw reqResult.error;
          setRequest(reqResult.data as QuoteRequest);
          setQuotes((quotesResult.data || []) as Quote[]);
        } catch (err) {
          console.error('데이터 로딩 실패:', err);
          // Fall back to mock data
          setRequest(mockQuoteRequests.find((r) => r.id === requestId) || null);
          setQuotes(mockQuotes.filter((q) => q.request_id === requestId));
        }
      } else {
        setRequest(mockQuoteRequests.find((r) => r.id === requestId) || null);
        setQuotes(mockQuotes.filter((q) => q.request_id === requestId));
      }
      setLoading(false);
    }

    fetchData();
  }, [requestId, isLoggedIn, authLoading]);

  const sortedQuotes = useMemo(() => {
    const sorted = [...quotes];
    switch (sortBy) {
      case 'price':
        sorted.sort((a, b) => a.total_price - b.total_price);
        break;
      case 'rating': {
        sorted.sort((a, b) => {
          const dA = mockDrivers.find((d) => d.id === a.driver_id);
          const dB = mockDrivers.find((d) => d.id === b.driver_id);
          return (dB?.rating || 0) - (dA?.rating || 0);
        });
        break;
      }
      case 'latest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    return sorted;
  }, [quotes, sortBy]);

  const selectedQuote = quotes.find((q) => q.id === selectedQuoteId);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>견적 요청을 찾을 수 없습니다.</p>
        <Link href="/customer/quotes" className="text-blue-600 hover:underline mt-2 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleSelect = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedQuote) return;

    if (isLoggedIn && currentUser) {
      setReserving(true);
      try {
        const depositRate = 0.2;
        const depositAmount = Math.round(selectedQuote.total_price * depositRate);
        const { error } = await createReservation({
          reservation_number: `RSV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          quote_id: selectedQuote.id,
          customer_id: currentUser.id,
          driver_id: selectedQuote.driver_id,
          total_amount: selectedQuote.total_price,
          deposit_amount: depositAmount,
          remaining_amount: selectedQuote.total_price - depositAmount,
        });
        if (error) throw error;

        // Update quote status to 'selected'
        await updateQuoteStatus(selectedQuote.id, 'selected');
        // Update request status to 'reserved'
        await updateQuoteRequestStatus(requestId, 'reserved');

        toast.success('예약이 완료되었습니다!');
      } catch (err: any) {
        console.error('예약 실패:', err);
        toast.error(err?.message || '예약 처리 중 오류가 발생했습니다.');
        setReserving(false);
        return;
      }
      setReserving(false);
    }

    setConfirmModal(false);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 4000);
  };

  return (
    <div className="py-2 px-4 sm:px-6">
      {/* Back */}
      <Link
        href="/customer/quotes"
        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        견적 목록
      </Link>

      {/* Route Summary */}
      <Card padding="md" className="mb-6 bg-gradient-to-r from-blue-50 to-white border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {request.departure_address.split(' ').slice(0, 3).join(' ')}
              <ArrowRight className="w-4 h-4 text-gray-400" />
              {request.destination_address.split(' ').slice(0, 3).join(' ')}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(request.departure_datetime).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {request.passenger_count}명
              </span>
              <span className="flex items-center gap-1">
                <Bus className="w-3.5 h-3.5" />
                {request.vehicle_type.map(getVehicleLabel).join(', ')}
              </span>
              <Badge variant="info" size="sm">
                {request.trip_type === 'round' ? '왕복' : '편도'}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">견적</span>
            <p className="text-2xl font-bold text-blue-600">{quotes.length}건</p>
          </div>
        </div>
      </Card>

      {/* Sort Options */}
      <div className="flex items-center gap-2 mb-4">
        <SortAsc className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500 mr-1">정렬:</span>
        {([
          { key: 'price', label: '가격순' },
          { key: 'rating', label: '평점순' },
          { key: 'latest', label: '최신순' },
        ] as { key: SortOption; label: string }[]).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              sortBy === opt.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Quotes List */}
      {sortedQuotes.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium text-gray-500 mb-1">아직 견적이 없습니다</p>
          <p className="text-sm">기사님들의 견적을 기다려주세요. 보통 1~2시간 내에 도착합니다.</p>
        </div>
      )}
      <div className="space-y-4">
        {sortedQuotes.map((quote) => {
          const driver = mockDrivers.find((d) => d.id === quote.driver_id);
          const vehicle = mockVehicles.find((v) => v.id === quote.vehicle_id);

          return (
            <Card key={quote.id} padding="none" hover>
              <div className="p-5">
                {/* Driver Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {(driverNames[quote.driver_id] || '기사')[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {driverNames[quote.driver_id] || '기사'} 기사님
                      </span>
                      <span className="text-sm text-gray-500">{driver?.company_name}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{driver?.rating}</span>
                      <span className="text-xs text-gray-500">({driver?.review_count}건)</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                {vehicle && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                      🚌
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{vehicle.vehicle_name}</p>
                      <p className="text-xs text-gray-500">
                        {vehicle.year}년식 | {vehicle.seats}석 | {getVehicleLabel(vehicle.vehicle_type)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">기본 운행료</span>
                    <span className="text-gray-700">{formatPrice(quote.base_price)}</span>
                  </div>
                  {quote.toll_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">톨비</span>
                      <span className="text-gray-700">{formatPrice(quote.toll_fee)}</span>
                    </div>
                  )}
                  {quote.meal_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">식사비</span>
                      <span className="text-gray-700">{formatPrice(quote.meal_fee)}</span>
                    </div>
                  )}
                  {quote.parking_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">주차비</span>
                      <span className="text-gray-700">{formatPrice(quote.parking_fee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">총 금액</span>
                    <span className="text-2xl sm:text-xl font-bold text-blue-600">
                      {formatPrice(quote.total_price)}
                    </span>
                  </div>
                  {quote.vat_included && (
                    <p className="text-xs text-gray-500 text-right">VAT 포함</p>
                  )}
                </div>

                {/* Driver Message */}
                <div className="flex gap-2 p-3 bg-blue-50 rounded-lg mb-4">
                  <MessageCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 leading-relaxed">{quote.message}</p>
                </div>

                {/* Select Button */}
                <Button fullWidth size="lg" onClick={() => handleSelect(quote.id)} className="min-h-[48px]">
                  선택하기
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="예약 확인"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmModal(false)}>
              취소
            </Button>
            <Button onClick={handleConfirm}>
              예약하기
            </Button>
          </>
        }
      >
        {selectedQuote && (
          <div className="space-y-4">
            <p className="text-gray-600">
              선택하신 견적으로 예약을 진행하시겠습니까?
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">기사</span>
                <span className="font-medium">
                  {driverNames[selectedQuote.driver_id] || '기사'} 기사님
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">총 금액</span>
                <span className="font-bold text-blue-600">
                  {formatPrice(selectedQuote.total_price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">예약금 (20%)</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(Math.round(selectedQuote.total_price * 0.2))}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              예약금 결제 후 예약이 확정됩니다. 잔금은 운행 전일까지 결제해주세요.
            </p>
          </div>
        )}
      </Modal>

      {/* Confirmed Toast */}
      {confirmed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          예약이 완료되었습니다! 예약금 결제를 진행해주세요.
        </div>
      )}
    </div>
  );
}
