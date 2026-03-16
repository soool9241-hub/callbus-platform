'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

type PaymentMethod = 'card' | 'kakao' | 'naver' | 'toss' | 'bank';

interface PaymentOption {
  key: PaymentMethod;
  label: string;
  icon: string;
  color: string;
}

const paymentMethods: PaymentOption[] = [
  { key: 'card', label: '신용카드', icon: '💳', color: 'border-blue-500 bg-blue-50' },
  { key: 'kakao', label: '카카오페이', icon: '🟡', color: 'border-yellow-500 bg-yellow-50' },
  { key: 'naver', label: '네이버페이', icon: '🟢', color: 'border-green-500 bg-green-50' },
  { key: 'toss', label: '토스페이', icon: '🔵', color: 'border-blue-400 bg-blue-50' },
  { key: 'bank', label: '계좌이체', icon: '🏦', color: 'border-gray-500 bg-gray-50' },
];

const orderSummary = {
  reservationNumber: 'RSV-2025-0001',
  route: '서울 강남역 → 속초 오션뷰 펜션',
  date: '2026-04-15 (금) 08:00',
  passengers: 35,
  amount: 614000,
};

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

export default function PaymentPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('결제 수단을 선택해주세요.');
      return;
    }
    if (!agreeTerms) {
      alert('결제 약관에 동의해주세요.');
      return;
    }
    alert('결제 시스템 준비 중입니다');
  };

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

      <h1 className="text-2xl font-bold text-gray-900 mb-6">결제하기</h1>

      {/* Order Summary */}
      <Card padding="md" className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">주문 내역</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">예약번호</span>
            <span className="font-mono text-gray-900">{orderSummary.reservationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">노선</span>
            <span className="text-gray-900">{orderSummary.route}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">출발일시</span>
            <span className="text-gray-900">{orderSummary.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">인원</span>
            <span className="text-gray-900">{orderSummary.passengers}명</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-base">
            <span>결제 금액</span>
            <span className="text-[#FF6B35]">{formatPrice(orderSummary.amount)}</span>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">결제 수단 선택</h3>
        <div className="grid grid-cols-1 gap-2">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.key;
            return (
              <button
                key={method.key}
                onClick={() => setSelectedMethod(method.key)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? method.color
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                  {method.label}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-[#1B6FF4] ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#1B6FF4] focus:ring-[#1B6FF4]"
          />
          <div className="text-sm">
            <span className="text-gray-700">결제 약관 및 개인정보 제3자 제공에 동의합니다.</span>
            <p className="text-xs text-gray-400 mt-0.5">전자금융거래 이용약관, 개인정보 수집 및 이용 동의</p>
          </div>
        </label>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-6 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span>모든 결제 정보는 SSL 암호화로 안전하게 처리됩니다.</span>
      </div>

      {/* Pay Button */}
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={handlePayment}
        disabled={!selectedMethod || !agreeTerms}
      >
        <CreditCard className="w-5 h-5" />
        {formatPrice(orderSummary.amount)} 결제하기
      </Button>
    </div>
  );
}
