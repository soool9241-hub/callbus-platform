'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Navigation,
  ArrowRight,
  Clock,
  Users,
  Wallet,
  User,
  Calendar,
  Bus,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockShuttle = {
  id: 'shuttle-001',
  name: '서울↔가평 주말 셔틀',
  departure: '서울 강남역 2번 출구',
  destination: '가평 힐링 펜션',
  schedule: '매주 금/토 14:00 출발, 일 11:00 복귀',
  vehicleType: '45인승 대형버스',
  totalSeats: 45,
  pricePerSeat: 15000,
  isActive: true,
  driver: {
    name: '김기사',
    phone: '010-1234-5678',
    vehicle: '현대 유니버스 럭셔리',
    plate: '서울 72바 1234',
  },
};

const mockCalendar = [
  { date: '2026-03-20 (금)', booked: 32, total: 45, status: 'available' as const },
  { date: '2026-03-21 (토)', booked: 45, total: 45, status: 'full' as const },
  { date: '2026-03-27 (금)', booked: 18, total: 45, status: 'available' as const },
  { date: '2026-03-28 (토)', booked: 40, total: 45, status: 'available' as const },
  { date: '2026-04-03 (금)', booked: 5, total: 45, status: 'available' as const },
  { date: '2026-04-04 (토)', booked: 0, total: 45, status: 'available' as const },
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export default function ShuttleDetailPage() {
  const router = useRouter();
  const [shuttle] = useState(mockShuttle);

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{shuttle.name}</h1>
          <Badge
            variant={shuttle.isActive ? 'success' : 'default'}
            size="sm"
            dot
          >
            {shuttle.isActive ? '운행중' : '미운행'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Info */}
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">노선 정보</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4 text-[#1B6FF4]" />
                  <span>{shuttle.departure}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span>{shuttle.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {shuttle.schedule}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bus className="w-4 h-4 text-gray-400" />
                  {shuttle.vehicleType}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    {shuttle.totalSeats}석
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-gray-400" />
                    {formatCurrency(shuttle.pricePerSeat)}원/석
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Calendar */}
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1B6FF4]" />
                좌석 현황
              </h2>
              <div className="space-y-3">
                {mockCalendar.map((day) => {
                  const percentage = Math.round((day.booked / day.total) * 100);
                  return (
                    <div
                      key={day.date}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 text-sm">{day.date}</span>
                        <Badge
                          variant={day.status === 'full' ? 'danger' : percentage >= 80 ? 'warning' : 'success'}
                          size="sm"
                        >
                          {day.status === 'full' ? '매진' : `잔여 ${day.total - day.booked}석`}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              day.status === 'full'
                                ? 'bg-red-500'
                                : percentage >= 80
                                ? 'bg-yellow-500'
                                : 'bg-[#10B981]'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">
                          {day.booked}/{day.total}석
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: Driver */}
        <div className="space-y-6">
          <Card>
            <div className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1B6FF4]" />
                배정 기사
              </h3>
              {shuttle.driver ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">기사명</span>
                    <span className="text-gray-900 font-medium">{shuttle.driver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">연락처</span>
                    <span className="text-gray-900">{shuttle.driver.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">차량</span>
                    <span className="text-gray-900">{shuttle.driver.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">차량번호</span>
                    <span className="text-gray-900">{shuttle.driver.plate}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">미배정</p>
                  <Button variant="primary" size="sm" className="mt-3">
                    기사 배정하기
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Revenue Summary */}
          <Card hover>
            <div className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">이번 달 매출</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(shuttle.pricePerSeat * 95)}
                <span className="text-base font-normal text-gray-500">원</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">총 95석 판매</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
