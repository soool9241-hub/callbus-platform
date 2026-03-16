'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Ticket } from 'lucide-react';

type CouponStatus = 'available' | 'used' | 'expired';

const tabs: { key: CouponStatus; label: string }[] = [
  { key: 'available', label: '사용가능' },
  { key: 'used', label: '사용완료' },
  { key: 'expired', label: '만료' },
];

interface Coupon {
  id: string;
  name: string;
  discount: string;
  discountType: 'percent' | 'amount';
  condition: string;
  expiry: string;
  status: CouponStatus;
  minAmount?: number;
}

const mockCoupons: Coupon[] = [
  {
    id: 'cpn-001',
    name: '첫 예약 할인',
    discount: '10%',
    discountType: 'percent',
    condition: '첫 예약 시 사용 가능 (최대 5만원)',
    expiry: '2026-06-30',
    status: 'available',
    minAmount: 100000,
  },
  {
    id: 'cpn-002',
    name: '봄맞이 특별 할인',
    discount: '15%',
    discountType: 'percent',
    condition: '가평/속초 노선 전용 (최대 8만원)',
    expiry: '2026-04-30',
    status: 'available',
    minAmount: 200000,
  },
  {
    id: 'cpn-003',
    name: '재이용 감사 쿠폰',
    discount: '20,000원',
    discountType: 'amount',
    condition: '30만원 이상 예약 시 사용 가능',
    expiry: '2026-05-15',
    status: 'available',
    minAmount: 300000,
  },
  {
    id: 'cpn-004',
    name: '리뷰 작성 감사 쿠폰',
    discount: '5,000원',
    discountType: 'amount',
    condition: '제한 없음',
    expiry: '2025-12-31',
    status: 'used',
  },
  {
    id: 'cpn-005',
    name: '겨울 시즌 할인',
    discount: '10%',
    discountType: 'percent',
    condition: '전 노선 사용 가능',
    expiry: '2025-02-28',
    status: 'expired',
  },
];

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<CouponStatus>('available');
  const [toast, setToast] = useState('');

  const filtered = mockCoupons.filter((c) => c.status === activeTab);

  const statusBadge = (status: CouponStatus) => {
    switch (status) {
      case 'available':
        return <Badge variant="success" size="sm">사용가능</Badge>;
      case 'used':
        return <Badge variant="default" size="sm">사용완료</Badge>;
      case 'expired':
        return <Badge variant="danger" size="sm">만료</Badge>;
    }
  };

  return (
    <div className="py-2 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">내 쿠폰</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            {tab.key === 'available' && (
              <span className="ml-1">({mockCoupons.filter((c) => c.status === 'available').length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Coupon List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{activeTab === 'available' ? '사용 가능한 쿠폰이 없습니다.' : activeTab === 'used' ? '사용한 쿠폰이 없습니다.' : '만료된 쿠폰이 없습니다.'}</p>
          </div>
        )}

        {filtered.map((coupon) => {
          const isActive = coupon.status === 'available';
          return (
            <div
              key={coupon.id}
              className={`relative rounded-xl border-2 border-dashed overflow-hidden ${
                isActive ? 'border-[#FF6B35] bg-white' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex">
                {/* Left: Discount */}
                <div className={`flex flex-col items-center justify-center px-5 py-6 min-w-[120px] ${
                  isActive
                    ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  <span className="text-2xl font-bold leading-tight">{coupon.discount}</span>
                  <span className="text-xs mt-1 opacity-80">할인</span>
                </div>

                {/* Dotted separator */}
                <div className="flex flex-col justify-around py-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-0.5 h-1.5 ${isActive ? 'bg-[#FF6B35]/30' : 'bg-gray-300'}`} />
                  ))}
                </div>

                {/* Right: Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {coupon.name}
                    </h3>
                    {statusBadge(coupon.status)}
                  </div>
                  <p className={`text-xs mb-2 ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                    {coupon.condition}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>
                      ~{coupon.expiry}까지
                    </span>
                    {isActive && (
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => { setToast('쿠폰이 적용되었습니다. 예약 시 자동 할인됩니다.'); setTimeout(() => setToast(''), 2000); }}
                      >
                        사용하기
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Circle cutouts */}
              <div className="absolute left-[120px] top-[-8px] w-4 h-4 rounded-full bg-gray-100 border border-gray-200" style={{ transform: 'translateX(-50%)' }} />
              <div className="absolute left-[120px] bottom-[-8px] w-4 h-4 rounded-full bg-gray-100 border border-gray-200" style={{ transform: 'translateX(-50%)' }} />
            </div>
          );
        })}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
