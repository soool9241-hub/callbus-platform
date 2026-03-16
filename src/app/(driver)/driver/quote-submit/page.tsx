'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Users,
  Bus,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { mockQuoteRequests, mockVehicles } from '@/lib/mock-data';
import { VEHICLE_TYPES } from '@/types';
import type { QuoteRequest, Vehicle } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { getQuoteRequestById, getDriverVehicles, getDriverByUserId, createQuote } from '@/lib/supabase-db';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

function getVehicleTypeLabel(typeKeys: string[]): string {
  return typeKeys
    .map((key) => {
      const found = VEHICLE_TYPES.find((v) => v.key === key);
      return found ? found.label : key;
    })
    .join(', ');
}

function QuoteSubmitContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId') || 'req-001';
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { currentUser } = useStore();

  const [request, setRequest] = useState<QuoteRequest | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [driverId, setDriverId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [basePrice, setBasePrice] = useState<number>(0);
  const [tollFee, setTollFee] = useState<number>(0);
  const [mealFee, setMealFee] = useState<number>(0);
  const [parkingFee, setParkingFee] = useState<number>(0);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vatIncluded, setVatIncluded] = useState(true);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (authLoading) return;

    async function fetchData() {
      if (isLoggedIn && currentUser) {
        try {
          const [reqResult, driverResult] = await Promise.all([
            getQuoteRequestById(requestId),
            getDriverByUserId(currentUser.id),
          ]);
          if (reqResult.data) setRequest(reqResult.data as QuoteRequest);
          else setRequest(mockQuoteRequests.find((r) => r.id === requestId) || mockQuoteRequests[0]);

          if (driverResult.data) {
            setDriverId(driverResult.data.id);
            const vehiclesResult = await getDriverVehicles(driverResult.data.id);
            if (vehiclesResult.data && vehiclesResult.data.length > 0) {
              setVehicles(vehiclesResult.data as Vehicle[]);
            }
          }
        } catch (err) {
          console.error('데이터 로딩 실패:', err);
          setRequest(mockQuoteRequests.find((r) => r.id === requestId) || mockQuoteRequests[0]);
        }
      } else {
        setRequest(mockQuoteRequests.find((r) => r.id === requestId) || mockQuoteRequests[0]);
      }
      setLoading(false);
    }

    fetchData();
  }, [requestId, isLoggedIn, currentUser, authLoading]);

  const subtotal = basePrice + tollFee + mealFee + parkingFee;
  const vatAmount = vatIncluded ? 0 : Math.floor(subtotal * 0.1);
  const total = subtotal + vatAmount;

  const vehicleOptions = vehicles
    .filter((v) => v.is_active)
    .map((v) => ({
      value: v.id,
      label: `${v.vehicle_name} (${v.plate_number}) - ${v.seats}인승`,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoggedIn && driverId) {
      setSubmitting(true);
      try {
        const { error } = await createQuote({
          request_id: requestId,
          driver_id: driverId,
          vehicle_id: selectedVehicle,
          base_price: basePrice,
          toll_fee: tollFee,
          meal_fee: mealFee,
          parking_fee: parkingFee,
          total_price: total,
          vat_included: vatIncluded,
          message,
        });
        if (error) throw error;
      } catch (err) {
        console.error('견적 제출 실패:', err);
        setToast('견적 제출 중 오류가 발생했습니다. 다시 시도해주세요.'); setTimeout(() => setToast(''), 2000);
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }

    setSubmitted(true);
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>견적 요청을 찾을 수 없습니다.</p>
        <Link href="/driver/dashboard" className="text-green-600 hover:underline mt-2 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">견적이 제출되었습니다!</h2>
            <p className="text-gray-500 max-w-md">
              고객이 견적을 검토한 후 선택하면 알림을 보내드립니다.
              <br />
              견적 요청번호: <span className="font-semibold">{request.request_number}</span>
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="/driver/dashboard">
                <Button className="bg-green-600 hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500">
                  견적 목록으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/driver/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">견적 제출</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Request Details + Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="info" size="sm">
                  {request.request_number}
                </Badge>
                <Badge
                  variant={request.trip_type === 'round' ? 'success' : 'default'}
                  size="sm"
                >
                  {request.trip_type === 'round' ? '왕복' : '편도'}
                </Badge>
              </div>

              {/* Route */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <div className="w-px h-6 bg-gray-300" />
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {request.departure_address}
                  </p>
                  <div className="flex items-center my-1">
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {request.destination_address}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">출발일</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(request.departure_datetime)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(request.departure_datetime)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs">인원</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {request.passenger_count}명
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <Bus className="w-3.5 h-3.5" />
                    <span className="text-xs">차량</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {getVehicleTypeLabel(request.vehicle_type)}
                  </p>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">이용목적</div>
                  <p className="text-sm font-medium text-gray-900">
                    {request.purpose}
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              {request.special_requests && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs font-medium text-yellow-800 mb-1">요청사항</p>
                  <p className="text-sm text-yellow-700">{request.special_requests}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quote Form */}
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">견적 정보 입력</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Price Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="기본 운행료"
                      type="number"
                      value={basePrice || ''}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      placeholder="0"
                      suffixIcon={<span className="text-sm text-gray-500">원</span>}
                    />
                  </div>
                  <div>
                    <Input
                      label="톨비"
                      type="number"
                      value={tollFee || ''}
                      onChange={(e) => setTollFee(Number(e.target.value))}
                      placeholder="0"
                      suffixIcon={<span className="text-sm text-gray-500">원</span>}
                    />
                  </div>
                  <div>
                    <Input
                      label="기사 식사비"
                      type="number"
                      value={mealFee || ''}
                      onChange={(e) => setMealFee(Number(e.target.value))}
                      placeholder="0"
                      suffixIcon={<span className="text-sm text-gray-500">원</span>}
                    />
                  </div>
                  <div>
                    <Input
                      label="주차비"
                      type="number"
                      value={parkingFee || ''}
                      onChange={(e) => setParkingFee(Number(e.target.value))}
                      placeholder="0"
                      suffixIcon={<span className="text-sm text-gray-500">원</span>}
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-800">합계</span>
                    <span className="text-2xl font-bold text-green-700">
                      {formatCurrency(total)}원
                    </span>
                  </div>
                  {!vatIncluded && vatAmount > 0 && (
                    <p className="text-sm text-green-600 mt-1 text-right">
                      (VAT {formatCurrency(vatAmount)}원 포함)
                    </p>
                  )}
                </div>

                {/* Vehicle Selection */}
                <Select
                  label="배차 차량 선택"
                  options={vehicleOptions}
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  placeholder="차량을 선택하세요"
                />

                {/* VAT Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="vatIncluded"
                    checked={vatIncluded}
                    onChange={(e) => setVatIncluded(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="vatIncluded" className="text-sm font-medium text-gray-700">
                    VAT 포함 가격입니다
                  </label>
                </div>

                {/* Message */}
                <Textarea
                  label="고객에게 메시지"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="고객에게 전달할 메시지를 입력하세요. (차량 소개, 경험, 특이사항 등)"
                  rows={4}
                />

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Link href="/driver/dashboard">
                    <Button variant="outline" type="button">
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        처리중...
                      </>
                    ) : (
                      '견적 제출'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Right Column: Price Summary */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                견적 요약
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">기본 운행료</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(basePrice)}원
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">톨비</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(tollFee)}원
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">기사 식사비</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(mealFee)}원
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">주차비</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(parkingFee)}원
                  </span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">소계</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(subtotal)}원
                  </span>
                </div>

                {!vatIncluded && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">VAT (10%)</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(vatAmount)}원
                    </span>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">합계</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(total)}원
                  </span>
                </div>

                {vatIncluded && (
                  <p className="text-xs text-gray-400 text-right">VAT 포함</p>
                )}
              </div>

              {/* Selected Vehicle */}
              {selectedVehicle && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">배차 차량</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vehicles.find((v) => v.id === selectedVehicle)?.vehicle_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {vehicles.find((v) => v.id === selectedVehicle)?.plate_number}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function QuoteSubmitPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">로딩 중...</div>}>
      <QuoteSubmitContent />
    </Suspense>
  );
}
