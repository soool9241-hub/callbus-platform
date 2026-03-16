'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  Tag,
  AlertCircle,
} from 'lucide-react';
import {
  type PaymentMethodType,
  type PriceBreakdown,
  formatPrice,
  calculatePriceBreakdown,
  generateOrderId,
  requestPayment,
} from '@/lib/payments';

// ── 타입 ──────────────────────────────────────────────────

export interface OrderSummary {
  reservationNumber: string;
  busType: string;
  route: string;
  date: string;
  passengers: number;
  basePrice: number;
}

interface PaymentMethodOption {
  key: PaymentMethodType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

// ── 결제 수단 목록 ───────────────────────────────────────────

const paymentMethods: PaymentMethodOption[] = [
  {
    key: 'CARD',
    label: '카드',
    description: '신용카드 / 체크카드',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    key: 'VIRTUAL_ACCOUNT',
    label: '가상계좌',
    description: '은행 가상계좌 입금',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    key: 'TRANSFER',
    label: '계좌이체',
    description: '실시간 계좌이체',
    icon: <Banknote className="w-5 h-5" />,
  },
  {
    key: 'EASY_PAY',
    label: '간편결제',
    description: '카카오페이, 네이버페이, 토스페이 등',
    icon: <Smartphone className="w-5 h-5" />,
  },
];

// ── 목 데이터 ────────────────────────────────────────────────

const mockOrder: OrderSummary = {
  reservationNumber: 'RSV-2026-0315',
  busType: '45인승 우등버스',
  route: '서울 강남역 → 속초 오션뷰 펜션',
  date: '2026-04-15 (수) 08:00',
  passengers: 35,
  basePrice: 650000,
};

// ── 컴포넌트 ────────────────────────────────────────────────

export default function PaymentWidget() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceBreakdown: PriceBreakdown = calculatePriceBreakdown(
    mockOrder.basePrice,
    discount
  );

  const handleApplyCoupon = useCallback(() => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('쿠폰 코드를 입력해주세요.');
      return;
    }
    // 목 쿠폰 적용 (BUSGO10 → 10% 할인)
    if (couponCode.toUpperCase() === 'BUSGO10') {
      const discountAmount = Math.round(mockOrder.basePrice * 0.1);
      setDiscount(discountAmount);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('유효하지 않은 쿠폰 코드입니다.');
      setCouponApplied(false);
      setDiscount(0);
    }
  }, [couponCode]);

  const handleRemoveCoupon = useCallback(() => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponError('');
    setDiscount(0);
  }, []);

  const handlePayment = useCallback(async () => {
    if (!selectedMethod) {
      setError('결제 수단을 선택해주세요.');
      return;
    }
    if (!agreeTerms) {
      setError('결제 약관에 동의해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderId = generateOrderId();
      const origin = window.location.origin;

      await requestPayment({
        method: selectedMethod,
        orderId,
        orderName: `버스고 - ${mockOrder.route}`,
        amount: priceBreakdown.total,
        customerName: '홍길동',
        customerEmail: 'test@busgo.kr',
        customerMobilePhone: '01012345678',
        successUrl: `${origin}/customer/payment/success`,
        failUrl: `${origin}/customer/payment/fail`,
      });
    } catch (err: any) {
      // 사용자가 결제 창을 닫은 경우
      if (err?.code === 'USER_CANCEL') {
        setError(null);
      } else {
        setError(err?.message || '결제 요청 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedMethod, agreeTerms, priceBreakdown.total]);

  return (
    <div className="py-2 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        뒤로가기
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">결제하기</h1>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* 주문 내역 */}
      <Card padding="md" className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">주문 내역</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">예약번호</span>
            <span className="font-mono text-gray-900">{mockOrder.reservationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">버스 종류</span>
            <Badge variant="info" size="sm">{mockOrder.busType}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">노선</span>
            <span className="text-gray-900 text-right max-w-[200px]">{mockOrder.route}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">출발일시</span>
            <span className="text-gray-900">{mockOrder.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">인원</span>
            <span className="text-gray-900">{mockOrder.passengers}명</span>
          </div>
        </div>
      </Card>

      {/* 결제 수단 선택 */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">결제 수단 선택</h3>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.key;
            return (
              <button
                key={method.key}
                onClick={() => {
                  setSelectedMethod(method.key);
                  setError(null);
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? 'border-[#1B6FF4] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-[#1B6FF4] text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {method.icon}
                </div>
                <div>
                  <div
                    className={`text-sm font-medium ${
                      isSelected ? 'text-[#1B6FF4]' : 'text-gray-700'
                    }`}
                  >
                    {method.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{method.description}</div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-[#1B6FF4] absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 쿠폰 입력 */}
      <Card padding="md" className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-[#FF6B35]" />
          쿠폰 적용
        </h3>
        {couponApplied ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span className="text-sm text-green-700 font-medium">
                쿠폰 적용 완료 (-{formatPrice(discount)})
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="쿠폰 코드를 입력하세요"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError('');
                }}
                error={couponError}
              />
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={handleApplyCoupon}
              className="flex-shrink-0 self-start"
            >
              적용
            </Button>
          </div>
        )}
      </Card>

      {/* 결제 금액 상세 */}
      <Card padding="md" className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">결제 금액</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">기본 요금</span>
            <span className="text-gray-900">{formatPrice(priceBreakdown.basePrice)}</span>
          </div>
          {priceBreakdown.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">쿠폰 할인</span>
              <span className="text-[#1B6FF4] font-medium">-{formatPrice(priceBreakdown.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">플랫폼 수수료 (3%)</span>
            <span className="text-gray-900">{formatPrice(priceBreakdown.platformFee)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-base">
            <span>총 결제 금액</span>
            <span className="text-[#FF6B35]">{formatPrice(priceBreakdown.total)}</span>
          </div>
        </div>
      </Card>

      {/* 약관 동의 */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              setError(null);
            }}
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#1B6FF4] focus:ring-[#1B6FF4]"
          />
          <div className="text-sm">
            <span className="text-gray-700">결제 약관 및 개인정보 제3자 제공에 동의합니다.</span>
            <p className="text-xs text-gray-400 mt-0.5">
              전자금융거래 이용약관, 개인정보 수집 및 이용 동의
            </p>
          </div>
        </label>
      </div>

      {/* 보안 안내 */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-6 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span>모든 결제 정보는 토스페이먼츠를 통해 SSL 암호화로 안전하게 처리됩니다.</span>
      </div>

      {/* 결제 버튼 */}
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={handlePayment}
        loading={loading}
        disabled={!selectedMethod || !agreeTerms}
      >
        <CreditCard className="w-5 h-5" />
        {formatPrice(priceBreakdown.total)} 결제하기
      </Button>
    </div>
  );
}
