'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Bus,
  CreditCard,
  X,
  Navigation,
  Star,
  AlertCircle,
  CheckCircle2,
  Circle,
} from 'lucide-react';

const reservationData = {
  id: 'rsv-001',
  reservationNumber: 'RSV-2025-0001',
  status: 'confirmed',
  route: {
    departure: '서울 강남역 2번 출구',
    destination: '속초 오션뷰 펜션',
    date: '2026-04-15',
    departureTime: '08:00',
    arrivalTime: '10:30',
  },
  driver: {
    name: '박정훈',
    rating: 4.8,
    reviewCount: 256,
    vehicle: '45인승 현대 유니버스 우등',
    vehicleNumber: '서울 70사 1234',
    phone: '010-1234-5678',
    company: '한국관광버스',
  },
  pricing: {
    base: 850000,
    toll: 24000,
    meal: 30000,
    parking: 10000,
    total: 914000,
  },
  payment: {
    depositPaid: 300000,
    remaining: 614000,
  },
  timeline: [
    { status: 'requested', label: '견적 요청', done: true, date: '2026-03-10' },
    { status: 'quoted', label: '견적 수신', done: true, date: '2026-03-10' },
    { status: 'deposit_paid', label: '예약금 결제', done: true, date: '2026-03-11' },
    { status: 'confirmed', label: '예약 확정', done: true, date: '2026-03-11' },
    { status: 'in_progress', label: '운행 시작', done: false, date: '' },
    { status: 'completed', label: '운행 완료', done: false, date: '' },
  ],
  createdAt: '2026-03-10T14:30:00',
  canCancelFree: true,
};

const statusConfig: Record<string, { label: string; variant: 'info' | 'success' | 'warning' | 'danger' | 'default' | 'purple' }> = {
  pending_payment: { label: '결제대기', variant: 'warning' },
  deposit_paid: { label: '예약금 결제', variant: 'info' },
  confirmed: { label: '예약 확정', variant: 'success' },
  in_progress: { label: '운행중', variant: 'purple' },
  completed: { label: '완료', variant: 'default' },
  cancelled: { label: '취소', variant: 'danger' },
};

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

export default function ReservationDetailPage() {
  const router = useRouter();
  const rsv = reservationData;
  const status = statusConfig[rsv.status] || statusConfig.confirmed;
  const [toast, setToast] = useState('');
  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); }, []);

  return (
    <div className="py-2 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        뒤로가기
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-mono text-gray-500 mb-1">{rsv.reservationNumber}</p>
          <h1 className="text-2xl font-bold text-gray-900">예약 상세</h1>
        </div>
        <Badge variant={status.variant} size="md" dot>
          {status.label}
        </Badge>
      </div>

      {/* Timeline */}
      <Card padding="md" className="mb-4">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">진행 상태</h3>
        <div className="relative">
          {rsv.timeline.map((step, i) => (
            <div key={step.status} className="flex items-start gap-3 mb-4 last:mb-0">
              <div className="flex flex-col items-center">
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                {i < rsv.timeline.length - 1 && (
                  <div className={`w-0.5 h-6 ${step.done ? 'bg-[#10B981]' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="flex-1 -mt-0.5">
                <p className={`text-sm font-medium ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-xs text-gray-400">{step.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Route Info */}
      <Card padding="md" className="mb-4">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">노선 정보</h3>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#1B6FF4]" />
            <div className="w-0.5 h-10 bg-gray-200" />
            <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{rsv.route.departure}</p>
              <p className="text-xs text-gray-500">{rsv.route.date} {rsv.route.departureTime} 출발</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{rsv.route.destination}</p>
              <p className="text-xs text-gray-500">{rsv.route.date} {rsv.route.arrivalTime} 도착 예정</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Driver Info */}
      <Card padding="md" className="mb-4">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">기사 정보</h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-[#1B6FF4] font-bold text-lg">
            {rsv.driver.name[0]}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{rsv.driver.name} 기사님</p>
            <p className="text-xs text-gray-500">{rsv.driver.company}</p>
            <div className="flex items-center gap-1 mt-1">
              <StarRating value={rsv.driver.rating} size="sm" readOnly />
              <span className="text-xs text-gray-500">{rsv.driver.rating} ({rsv.driver.reviewCount})</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Bus className="w-4 h-4 text-gray-400" />
            <span>{rsv.driver.vehicle}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-mono">{rsv.driver.vehicleNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a href={`tel:${rsv.driver.phone}`} className="text-[#1B6FF4] underline">{rsv.driver.phone}</a>
          </div>
        </div>
      </Card>

      {/* Price Breakdown */}
      <Card padding="md" className="mb-4">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">비용 상세</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">기본 운행료</span>
            <span>{formatPrice(rsv.pricing.base)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">통행료</span>
            <span>{formatPrice(rsv.pricing.toll)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">식대</span>
            <span>{formatPrice(rsv.pricing.meal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">주차비</span>
            <span>{formatPrice(rsv.pricing.parking)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-base">
            <span>총 금액</span>
            <span className="text-[#FF6B35]">{formatPrice(rsv.pricing.total)}</span>
          </div>
        </div>
      </Card>

      {/* Payment Info */}
      <Card padding="md" className="mb-4">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">결제 정보</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">예약금 결제</span>
            <span className="text-[#10B981] font-medium">{formatPrice(rsv.payment.depositPaid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">잔금</span>
            <span className="font-bold text-gray-900">{formatPrice(rsv.payment.remaining)}</span>
          </div>
        </div>
      </Card>

      {/* 24h Free Cancellation */}
      {rsv.canCancelFree && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-6 text-sm text-blue-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>예약 후 24시간 이내 무료 취소가 가능합니다.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mb-6">
        {(rsv.status === 'confirmed' || rsv.status === 'deposit_paid') && (
          <>
            <Button variant="primary" fullWidth size="lg" onClick={() => showToast('잔금 결제 페이지로 이동합니다.')}>
              <CreditCard className="w-4 h-4" />
              잔금 결제 ({formatPrice(rsv.payment.remaining)})
            </Button>
            <Button variant="danger" fullWidth size="md" onClick={() => showToast('예약을 취소하시겠습니까?')}>
              <X className="w-4 h-4" />
              예약 취소
            </Button>
          </>
        )}
        {rsv.status === 'in_progress' && (
          <Button variant="primary" fullWidth size="lg" onClick={() => showToast('실시간 위치 추적 화면으로 이동합니다.')}>
            <Navigation className="w-4 h-4" />
            실시간 위치 확인
          </Button>
        )}
        {rsv.status === 'completed' && (
          <Button variant="accent" fullWidth size="lg" onClick={() => router.push('/customer/reviews/new')}>
            <Star className="w-4 h-4" />
            리뷰 작성
          </Button>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
