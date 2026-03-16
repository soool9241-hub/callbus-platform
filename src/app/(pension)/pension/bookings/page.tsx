'use client';

import { useState } from 'react';
import {
  Calendar,
  Users,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { TabList, Tab } from '@/components/ui/Tabs';

const mockBookings = [
  {
    id: 'bk-001',
    type: 'package' as const,
    customerName: '김민수',
    customerPhone: '010-1234-5678',
    date: '2026-03-18',
    packageName: '가평 힐링 1박2일 패키지',
    guests: 25,
    amount: 2225000,
    status: 'confirmed' as const,
  },
  {
    id: 'bk-002',
    type: 'proxy' as const,
    customerName: '이지은',
    customerPhone: '010-2345-6789',
    date: '2026-03-19',
    packageName: '대리 견적 요청 (서울→가평)',
    guests: 40,
    amount: 0,
    status: 'in_progress' as const,
  },
  {
    id: 'bk-003',
    type: 'shuttle' as const,
    customerName: '박서연',
    customerPhone: '010-3456-7890',
    date: '2026-03-20',
    packageName: '서울↔가평 주말 셔틀',
    guests: 3,
    amount: 45000,
    status: 'confirmed' as const,
  },
  {
    id: 'bk-004',
    type: 'package' as const,
    customerName: '최영호',
    customerPhone: '010-4567-8901',
    date: '2026-03-22',
    packageName: '속초 바다 워크숍 패키지',
    guests: 28,
    amount: 4060000,
    status: 'pending' as const,
  },
  {
    id: 'bk-005',
    type: 'shuttle' as const,
    customerName: '정하나',
    customerPhone: '010-5678-9012',
    date: '2026-03-15',
    packageName: '서울↔가평 주말 셔틀',
    guests: 2,
    amount: 30000,
    status: 'completed' as const,
  },
];

const statusOptions = [
  { value: '', label: '전체 상태' },
  { value: 'confirmed', label: '확정' },
  { value: 'pending', label: '대기' },
  { value: 'in_progress', label: '진행중' },
  { value: 'completed', label: '완료' },
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

function getTypeBadge(type: string) {
  switch (type) {
    case 'package':
      return <Badge variant="purple" size="sm">패키지</Badge>;
    case 'shuttle':
      return <Badge variant="info" size="sm">셔틀</Badge>;
    case 'proxy':
      return <Badge variant="warning" size="sm">대리요청</Badge>;
    default:
      return <Badge variant="default" size="sm">{type}</Badge>;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'confirmed':
      return <Badge variant="success" size="sm" dot>확정</Badge>;
    case 'pending':
      return <Badge variant="warning" size="sm" dot>대기</Badge>;
    case 'in_progress':
      return <Badge variant="info" size="sm" dot>진행중</Badge>;
    case 'completed':
      return <Badge variant="default" size="sm" dot>완료</Badge>;
    default:
      return <Badge variant="default" size="sm">{status}</Badge>;
  }
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab !== 'all' && booking.type !== activeTab) return false;
    if (statusFilter && booking.status !== statusFilter) return false;
    if (dateFrom && booking.date < dateFrom) return false;
    if (dateTo && booking.date > dateTo) return false;
    return true;
  });

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <TabList activeValue={activeTab} onChange={setActiveTab} className="w-full overflow-x-auto">
          <Tab value="all">전체</Tab>
          <Tab value="proxy">대리요청</Tab>
          <Tab value="package">패키지</Tab>
          <Tab value="shuttle">셔틀</Tab>
        </TabList>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="전체 상태"
            />
          </div>
          <div className="flex gap-2 flex-1">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 min-h-[44px] focus:border-[#1B6FF4] focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/20"
              placeholder="시작일"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 min-h-[44px] focus:border-[#1B6FF4] focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/20"
              placeholder="종료일"
            />
          </div>
          {(statusFilter || dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter('');
                setDateFrom('');
                setDateTo('');
              }}
            >
              초기화
            </Button>
          )}
        </div>
      </Card>

      {/* Booking List */}
      {filteredBookings.length === 0 ? (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Search className="w-12 h-12 text-gray-300" />
            <p className="text-gray-500">조건에 맞는 예약이 없습니다.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} hover>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(booking.type)}
                    {getStatusBadge(booking.status)}
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {booking.date}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">{booking.packageName}</p>
                    <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Users className="w-3.5 h-3.5" />
                      {booking.guests}명
                    </span>
                  </div>
                  {booking.amount > 0 && (
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(booking.amount)}
                      <span className="text-sm font-normal text-gray-500">원</span>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
