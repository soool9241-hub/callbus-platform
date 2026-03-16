'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  FileText,
  Wallet,
  Star,
  ChevronRight,
  Bus,
  Package,
  Navigation,
  Clock,
  Users,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockBookings = [
  {
    id: '1',
    type: 'package' as const,
    customerName: '김민수',
    packageName: '가평 힐링 패키지',
    date: '2026-03-18',
    guests: 25,
    amount: 1250000,
    status: 'confirmed' as const,
  },
  {
    id: '2',
    type: 'shuttle' as const,
    customerName: '이지은',
    packageName: '서울↔양평 셔틀',
    date: '2026-03-18',
    guests: 3,
    amount: 45000,
    status: 'pending' as const,
  },
  {
    id: '3',
    type: 'proxy' as const,
    customerName: '박서연',
    packageName: '대리 견적 요청',
    date: '2026-03-19',
    guests: 40,
    amount: 0,
    status: 'in_progress' as const,
  },
  {
    id: '4',
    type: 'package' as const,
    customerName: '최영호',
    packageName: '속초 바다 패키지',
    date: '2026-03-20',
    guests: 30,
    amount: 1800000,
    status: 'confirmed' as const,
  },
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'confirmed':
      return <Badge variant="success" size="sm" dot>확정</Badge>;
    case 'pending':
      return <Badge variant="warning" size="sm" dot>대기</Badge>;
    case 'in_progress':
      return <Badge variant="info" size="sm" dot>진행중</Badge>;
    default:
      return <Badge variant="default" size="sm">{status}</Badge>;
  }
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

export default function PensionDashboardPage() {
  const [pensionName] = useState('가평 힐링 펜션');

  const stats = [
    {
      label: '오늘 예약',
      value: '3',
      unit: '건',
      icon: CalendarCheck,
      color: 'bg-blue-100',
      iconColor: 'text-[#1B6FF4]',
    },
    {
      label: '진행중 견적',
      value: '2',
      unit: '건',
      icon: FileText,
      color: 'bg-orange-100',
      iconColor: 'text-[#FF6B35]',
    },
    {
      label: '이번달 수입',
      value: '4,250,000',
      unit: '원',
      icon: Wallet,
      color: 'bg-green-100',
      iconColor: 'text-[#10B981]',
    },
    {
      label: '평균 평점',
      value: '4.7',
      unit: '',
      icon: Star,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
    },
  ];

  const quickActions = [
    {
      label: '대리 견적 요청',
      icon: FileText,
      href: '/pension/quote-request',
      color: 'bg-[#FF6B35]',
    },
    {
      label: '패키지 생성',
      icon: Package,
      href: '/pension/packages/new',
      color: 'bg-[#1B6FF4]',
    },
    {
      label: '셔틀 관리',
      icon: Navigation,
      href: '/pension/shuttles',
      color: 'bg-[#10B981]',
    },
  ];

  return (
    <div className="px-4 sm:px-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          안녕하세요, {pensionName} 사장님!
        </h1>
        <p className="text-sm text-gray-500 mt-1">오늘의 현황을 확인하세요.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.unit && (
                  <span className="text-base font-normal text-gray-500">{stat.unit}</span>
                )}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 메뉴</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card hover className="cursor-pointer">
                <div className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{action.label}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">최근 예약</h2>
          <Link href="/pension/bookings">
            <Button variant="ghost" size="sm">
              전체보기
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {mockBookings.map((booking) => (
            <Card key={booking.id} hover>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(booking.type)}
                    {getStatusBadge(booking.status)}
                  </div>
                  <span className="text-sm text-gray-500">{booking.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">{booking.packageName}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {booking.guests}명
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.date}
                      </span>
                    </div>
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
      </div>
    </div>
  );
}
