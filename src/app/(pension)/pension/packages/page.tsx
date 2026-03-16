'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Package,
  MapPin,
  Clock,
  Bus,
  Users,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TabList, Tab } from '@/components/ui/Tabs';

const mockPackages = [
  {
    id: 'pkg-001',
    name: '가평 힐링 1박2일 패키지',
    region: '경기 가평',
    duration: '1박 2일',
    vehicle: '45인승 대형버스',
    pricePerPerson: 89000,
    minPassengers: 20,
    maxPassengers: 45,
    status: 'active' as const,
    orderCount: 12,
  },
  {
    id: 'pkg-002',
    name: '속초 바다 워크숍 패키지',
    region: '강원 속초',
    duration: '2박 3일',
    vehicle: '28인승 중형버스',
    pricePerPerson: 145000,
    minPassengers: 15,
    maxPassengers: 28,
    status: 'pending' as const,
    orderCount: 0,
  },
  {
    id: 'pkg-003',
    name: '가평 당일치기 바베큐 패키지',
    region: '경기 가평',
    duration: '당일',
    vehicle: '25인승 미니버스',
    pricePerPerson: 55000,
    minPassengers: 10,
    maxPassengers: 25,
    status: 'draft' as const,
    orderCount: 0,
  },
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge variant="success" size="sm" dot>판매중</Badge>;
    case 'pending':
      return <Badge variant="warning" size="sm" dot>심사중</Badge>;
    case 'draft':
      return <Badge variant="default" size="sm">초안</Badge>;
    default:
      return <Badge variant="default" size="sm">{status}</Badge>;
  }
}

export default function PackagesPage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPackages = mockPackages.filter((pkg) => {
    if (statusFilter === 'all') return true;
    return pkg.status === statusFilter;
  });

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">패키지 관리</h1>
        <Link href="/pension/packages/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            새 패키지 만들기
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <TabList activeValue={statusFilter} onChange={setStatusFilter} className="w-full overflow-x-auto">
          <Tab value="all">전체</Tab>
          <Tab value="active">판매중</Tab>
          <Tab value="pending">심사중</Tab>
          <Tab value="draft">초안</Tab>
        </TabList>
      </div>

      {/* Package Cards */}
      <div className="space-y-4">
        {filteredPackages.length === 0 ? (
          <Card className="text-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Package className="w-12 h-12 text-gray-300" />
              <p className="text-gray-500">해당 상태의 패키지가 없습니다.</p>
            </div>
          </Card>
        ) : (
          filteredPackages.map((pkg) => (
            <Link key={pkg.id} href={`/pension/packages/${pkg.id}`}>
              <Card hover className="cursor-pointer mb-4">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(pkg.status)}
                      {pkg.orderCount > 0 && (
                        <span className="text-xs text-gray-500">{pkg.orderCount}건 판매</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{pkg.name}</h3>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {pkg.region}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-gray-400" />
                      {pkg.vehicle}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      {pkg.minPassengers}~{pkg.maxPassengers}명
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">1인당 가격</span>
                    <span className="text-lg font-bold text-[#1B6FF4]">
                      {formatCurrency(pkg.pricePerPerson)}
                      <span className="text-sm font-normal text-gray-500">원</span>
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
