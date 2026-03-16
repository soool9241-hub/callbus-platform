'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Navigation,
  ArrowRight,
  Clock,
  Users,
  User,
  Wallet,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockRoutes = [
  {
    id: 'shuttle-001',
    name: '서울↔가평 주말 셔틀',
    departure: '서울 강남역 2번 출구',
    destination: '가평 힐링 펜션',
    schedule: '매주 금/토 14:00 출발, 일 11:00 복귀',
    totalSeats: 45,
    pricePerSeat: 15000,
    driverAssigned: true,
    driverName: '김기사',
    isActive: true,
  },
  {
    id: 'shuttle-002',
    name: '잠실↔가평 평일 셔틀',
    departure: '서울 잠실역 3번 출구',
    destination: '가평 힐링 펜션',
    schedule: '매주 수/목 15:00 출발, 금 11:00 복귀',
    totalSeats: 28,
    pricePerSeat: 18000,
    driverAssigned: false,
    driverName: '',
    isActive: false,
  },
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export default function ShuttlesPage() {
  const [routes, setRoutes] = useState(mockRoutes);

  const handleToggleActive = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">셔틀 관리</h1>
        <Link href="/pension/shuttles/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            새 셔틀 노선
          </Button>
        </Link>
      </div>

      {/* Route Cards */}
      <div className="space-y-4">
        {routes.map((route) => (
          <Card key={route.id} hover>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                  <Badge
                    variant={route.isActive ? 'success' : 'default'}
                    size="sm"
                    dot
                  >
                    {route.isActive ? '운행중' : '미운행'}
                  </Badge>
                </div>
                <button
                  onClick={() => handleToggleActive(route.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    route.isActive ? 'bg-[#1B6FF4]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      route.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                <Navigation className="w-4 h-4 text-[#1B6FF4]" />
                <span>{route.departure}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span>{route.destination}</span>
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {route.schedule}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  {route.totalSeats}석
                </span>
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-gray-400" />
                  {formatCurrency(route.pricePerSeat)}원/석
                </span>
              </div>

              {/* Driver & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  {route.driverAssigned ? (
                    <span className="text-gray-900">배정 기사: {route.driverName}</span>
                  ) : (
                    <span className="text-[#FF6B35]">기사 미배정</span>
                  )}
                </div>
                <Link href={`/pension/shuttles/${route.id}`}>
                  <Button variant="outline" size="sm">
                    상세보기
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
