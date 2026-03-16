'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const COMMISSION_RATES = [
  { value: 8, label: '8%' },
  { value: 10, label: '10%' },
  { value: 12, label: '12%' },
];

export default function FeeCalculatorPage() {
  const [amount, setAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(10);

  const amountStr = amount > 0 ? amount.toString() : '';
  const platformFee = Math.round(amount * (rate / 100));
  const netAmount = amount - platformFee;
  const vat = Math.round(platformFee * 0.1);

  return (
    <div className="px-4 sm:px-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#1B6FF4] to-[#0B4FCC] rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-7 h-7" />
          <h1 className="text-2xl font-bold">수수료 계산기</h1>
        </div>
        <p className="text-blue-100 text-sm">견적 금액에 따른 실수령액을 확인해보세요</p>
      </div>

      {/* Input Section */}
      <Card className="mb-6">
        <div className="p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">견적 금액</label>
          <div className="relative mb-6">
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              placeholder="금액을 입력하세요"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-lg font-semibold text-gray-900 focus:border-[#1B6FF4] focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">원</span>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">수수료율</label>
          <div className="flex gap-3">
            {COMMISSION_RATES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRate(r.value)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors border ${
                  rate === r.value
                    ? 'bg-[#1B6FF4] text-white border-[#1B6FF4]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B6FF4] hover:text-[#1B6FF4]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Result Section */}
      <Card className="mb-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">계산 결과</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">견적 금액</span>
              <span className="text-sm font-medium text-gray-900">
                {amount > 0 ? `${amount.toLocaleString()}원` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">플랫폼 수수료 ({rate}%)</span>
              <span className="text-sm font-medium text-red-500">
                {amount > 0 ? `-${platformFee.toLocaleString()}원` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">VAT (수수료의 10%)</span>
              <span className="text-sm font-medium text-gray-600">
                {amount > 0 ? `${vat.toLocaleString()}원` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-base font-semibold text-gray-900">실수령액</span>
              <span className="text-2xl font-bold text-[#1B6FF4]">
                {amount > 0 ? `${netAmount.toLocaleString()}원` : '-'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="mb-6">
        <div className="p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#1B6FF4] shrink-0 mt-0.5" />
          <p className="text-sm text-gray-500">
            위 금액은 예상 금액이며, 실제 정산 시 세금 및 기타 요인에 따라 달라질 수 있습니다.
          </p>
        </div>
      </Card>

      {/* CTA */}
      <Link href="/driver/quote-submit">
        <Button
          fullWidth
          size="lg"
          className="bg-[#FF6B35] hover:bg-[#E55A2B] active:bg-[#CC4F25] focus-visible:ring-[#FF6B35]"
        >
          이 금액으로 견적 제출
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
}
