'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

const departureOptions = [
  { value: '', label: '출발 지역' },
  { value: 'seoul', label: '서울' },
  { value: 'incheon', label: '인천' },
  { value: 'suwon', label: '수원' },
  { value: 'daejeon', label: '대전' },
];

const destinationOptions = [
  { value: '', label: '도착 지역' },
  { value: 'sokcho', label: '속초' },
  { value: 'gapyeong', label: '가평' },
  { value: 'taean', label: '태안' },
  { value: 'gyeongju', label: '경주' },
  { value: 'jeju', label: '제주' },
  { value: 'yeosu', label: '여수' },
];

const vehicleOptions = [
  { value: '', label: '차량 유형' },
  { value: '25', label: '25인승 소형' },
  { value: '28', label: '28인승 중형' },
  { value: '45', label: '45인승 대형' },
  { value: '45p', label: '45인승 우등' },
];

// Mock monthly trend data
const monthlyData = [
  { month: '2025.10', price: 780000 },
  { month: '2025.11', price: 820000 },
  { month: '2025.12', price: 950000 },
  { month: '2026.01', price: 880000 },
  { month: '2026.02', price: 830000 },
  { month: '2026.03', price: 850000 },
];

const priceStats = {
  average: 851667,
  min: 780000,
  max: 950000,
};

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

export default function PriceTrendsPage() {
  const router = useRouter();
  const [departure, setDeparture] = useState('seoul');
  const [destination, setDestination] = useState('sokcho');
  const [vehicle, setVehicle] = useState('45');

  const maxPrice = Math.max(...monthlyData.map((d) => d.price));

  // Calculate trend
  const lastMonth = monthlyData[monthlyData.length - 1].price;
  const prevMonth = monthlyData[monthlyData.length - 2].price;
  const trendPercent = ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1);
  const isUp = lastMonth > prevMonth;

  return (
    <div className="py-2 px-4 sm:px-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">노선 시세 조회</h1>

      {/* Filters */}
      <Card padding="md" className="mb-6">
        <div className="space-y-3">
          <Select
            label="출발 지역"
            options={departureOptions}
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
          <Select
            label="도착 지역"
            options={destinationOptions}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <Select
            label="차량 유형"
            options={vehicleOptions}
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />
        </div>
      </Card>

      {/* Price Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500 mb-1">평균가</p>
          <p className="text-sm font-bold text-gray-900">{formatPrice(priceStats.average)}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500 mb-1">최저가</p>
          <p className="text-sm font-bold text-[#10B981]">{formatPrice(priceStats.min)}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500 mb-1">최고가</p>
          <p className="text-sm font-bold text-[#FF6B35]">{formatPrice(priceStats.max)}</p>
        </Card>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">전월 대비</span>
        <Badge variant={isUp ? 'danger' : 'success'} size="sm">
          {isUp ? (
            <TrendingUp className="w-3 h-3 inline mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 inline mr-1" />
          )}
          {isUp ? '+' : ''}{trendPercent}%
        </Badge>
      </div>

      {/* Bar Chart */}
      <Card padding="md" className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">월별 시세 추이 (최근 6개월)</h3>
        <div className="flex items-end gap-2 h-48">
          {monthlyData.map((d, i) => {
            const heightPercent = (d.price / maxPrice) * 100;
            const isLast = i === monthlyData.length - 1;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">
                  {(d.price / 10000).toFixed(0)}만
                </span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    isLast ? 'bg-[#1B6FF4]' : 'bg-blue-200'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs text-gray-400">{d.month.slice(5)}월</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* CTA */}
      <Button
        variant="accent"
        fullWidth
        size="lg"
        onClick={() => router.push('/customer/quote-request')}
      >
        이 노선 견적 요청
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
