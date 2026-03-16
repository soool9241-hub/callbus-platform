'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  MapPin,
  Star,
  DoorOpen,
  Home,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockPensions = [
  {
    id: 'pension-001',
    name: '가평 힐링 펜션',
    region: '경기 가평',
    address: '경기도 가평군 청평면 호반로 123',
    rating: 4.7,
    reviewCount: 48,
    roomCount: 8,
    status: 'active' as const,
    description: '자연 속에서 힐링할 수 있는 프리미엄 펜션',
  },
  {
    id: 'pension-002',
    name: '속초 바다 펜션',
    region: '강원 속초',
    address: '강원도 속초시 해변로 456',
    rating: 4.5,
    reviewCount: 32,
    roomCount: 6,
    status: 'pending' as const,
    description: '동해바다가 한눈에 보이는 오션뷰 펜션',
  },
];

export default function PensionsPage() {
  const [pensions] = useState(mockPensions);

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 펜션 목록</h1>
        <Link href="/pension/pensions/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            새 펜션 등록
          </Button>
        </Link>
      </div>

      {/* Pension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pensions.map((pension) => (
          <Link key={pension.id} href={`/pension/pensions/${pension.id}`}>
            <Card hover className="overflow-hidden cursor-pointer">
              {/* Photo Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center relative">
                <Home className="w-16 h-16 text-blue-300" />
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={pension.status === 'active' ? 'success' : 'warning'}
                    size="sm"
                    dot
                  >
                    {pension.status === 'active' ? '운영중' : '심사중'}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {pension.name}
                </h3>

                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {pension.region}
                </div>

                <p className="text-sm text-gray-600 mb-3">{pension.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {pension.rating} ({pension.reviewCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <DoorOpen className="w-4 h-4 text-gray-400" />
                    객실 {pension.roomCount}개
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
