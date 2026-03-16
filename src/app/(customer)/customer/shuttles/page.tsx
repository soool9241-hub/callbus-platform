'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { MapPin, Clock, Users, Bus } from 'lucide-react';

const mockShuttles = [
  {
    id: 'shuttle-001',
    routeName: '강남 → 속초 오션뷰 펜션',
    departure: '서울 강남역 2번 출구',
    destination: '속초 오션뷰 펜션',
    region: '속초',
    schedule: '매주 금요일 08:00 출발',
    availableSeats: 12,
    totalSeats: 45,
    pricePerSeat: 25000,
  },
  {
    id: 'shuttle-002',
    routeName: '잠실 → 가평 숲속 글램핑',
    departure: '서울 잠실역 4번 출구',
    destination: '가평 숲속 글램핑',
    region: '가평',
    schedule: '매주 토요일 09:00 출발',
    availableSeats: 8,
    totalSeats: 28,
    pricePerSeat: 18000,
  },
  {
    id: 'shuttle-003',
    routeName: '서울역 → 태안 꽃지해변 펜션',
    departure: '서울역 버스환승센터',
    destination: '태안 꽃지해변 펜션',
    region: '태안',
    schedule: '매주 금, 토 07:30 출발',
    availableSeats: 20,
    totalSeats: 45,
    pricePerSeat: 22000,
  },
  {
    id: 'shuttle-004',
    routeName: '강남 → 경주 한옥 스테이',
    departure: '서울 강남고속버스터미널',
    destination: '경주 한옥 스테이',
    region: '경주',
    schedule: '매주 금요일 07:00 출발',
    availableSeats: 3,
    totalSeats: 45,
    pricePerSeat: 35000,
  },
];

const regionOptions = [
  { value: '', label: '전체 지역' },
  { value: '속초', label: '속초' },
  { value: '가평', label: '가평' },
  { value: '태안', label: '태안' },
  { value: '경주', label: '경주' },
];

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

export default function ShuttlesPage() {
  const router = useRouter();
  const [region, setRegion] = useState('');

  const filtered = mockShuttles.filter((s) => {
    if (region && s.region !== region) return false;
    return true;
  });

  return (
    <div className="py-2 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">셔틀 노선</h1>

      {/* Region Filter */}
      <div className="mb-6">
        <Select
          options={regionOptions}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
      </div>

      {/* Shuttle List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bus className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>해당 지역의 셔틀 노선이 없습니다.</p>
          </div>
        )}

        {filtered.map((shuttle) => (
          <Card key={shuttle.id} hover padding="none">
            <div className="p-5">
              {/* Route name */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm">{shuttle.routeName}</h3>
                <Badge variant="info" size="sm">{shuttle.region}</Badge>
              </div>

              {/* Route details */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1B6FF4]" />
                  <div className="w-0.5 h-6 bg-gray-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-gray-700">{shuttle.departure}</p>
                  <p className="text-sm text-gray-700">{shuttle.destination}</p>
                </div>
              </div>

              {/* Info row */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {shuttle.schedule}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  잔여 {shuttle.availableSeats}/{shuttle.totalSeats}석
                </span>
              </div>

              {/* Price & Book */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-lg font-bold text-[#FF6B35]">{formatPrice(shuttle.pricePerSeat)}</span>
                  <span className="text-xs text-gray-500 ml-1">/ 1석</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/shuttles/${shuttle.id}`)}
                >
                  예약하기
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
