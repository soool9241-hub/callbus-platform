'use client';

import { useState } from 'react';
import {
  FileText,
  CalendarCheck,
  DollarSign,
  UserPlus,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const summaryCards = [
  { title: '오늘 견적 요청', value: '23건', change: '+12%', up: true, subtitle: '전일 대비', color: 'blue' as const, icon: FileText },
  { title: '오늘 예약 확정', value: '8건', change: '+5%', up: true, subtitle: '전일 대비', color: 'green' as const, icon: CalendarCheck },
  { title: '오늘 거래액', value: '\u20A912,340,000', change: '+8%', up: true, subtitle: '전일 대비', color: 'purple' as const, icon: DollarSign },
  { title: '신규 가입', value: '15명', change: '', up: true, subtitle: '오늘', color: 'orange' as const, icon: UserPlus },
];

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', text: 'text-green-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', text: 'text-orange-600' },
};

const weeklyRevenue = [
  { day: '\uC6D4', amount: 8200000, height: 55 },
  { day: '\uD654', amount: 9500000, height: 63 },
  { day: '\uC218', amount: 11200000, height: 75 },
  { day: '\uBAA9', amount: 7800000, height: 52 },
  { day: '\uAE08', amount: 12340000, height: 82 },
  { day: '\uD1A0', amount: 15000000, height: 100 },
  { day: '\uC77C', amount: 10500000, height: 70 },
];

const recentQuotes = [
  { id: 'Q-2026-0312', customer: '김철수', route: '서울 \u2192 부산', vehicle: '45인승', status: '대기', date: '2026-03-16 14:30' },
  { id: 'Q-2026-0311', customer: '이영희', route: '인천 \u2192 강릉', vehicle: '28인승', status: '견적접수', date: '2026-03-16 13:15' },
  { id: 'Q-2026-0310', customer: '박민수', route: '서울 \u2192 전주', vehicle: '45인승', status: '예약확정', date: '2026-03-16 11:42' },
  { id: 'Q-2026-0309', customer: '최지은', route: '수원 \u2192 경주', vehicle: '28인승', status: '만료', date: '2026-03-16 10:05' },
  { id: 'Q-2026-0308', customer: '정우성', route: '서울 \u2192 속초', vehicle: '25인승', status: '대기', date: '2026-03-16 09:20' },
];

const pendingDrivers = [
  { id: 1, name: '한승우', company: '대한관광', phone: '010-1234-5678', appliedAt: '2026-03-15' },
  { id: 2, name: '오지훈', company: '서울고속', phone: '010-9876-5432', appliedAt: '2026-03-15' },
  { id: 3, name: '윤서현', company: '코리아버스', phone: '010-5555-1234', appliedAt: '2026-03-14' },
];

const statusBadge: Record<string, { variant: 'info' | 'warning' | 'success' | 'default' | 'danger'; label: string }> = {
  '대기': { variant: 'warning', label: '대기' },
  '견적접수': { variant: 'info', label: '견적접수' },
  '예약확정': { variant: 'success', label: '예약확정' },
  '만료': { variant: 'default', label: '만료' },
};

export default function DashboardPage() {
  const [drivers, setDrivers] = useState(pendingDrivers);
  const conversionRate = 23.5;
  const circumference = 314.16;
  const dashArray = String((conversionRate / 100) * circumference) + ' ' + String(circumference);

  const handleApprove = (id: number) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  const handleReject = (id: number) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">오늘의 운영 현황을 한눈에 확인하세요.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const colors = colorMap[card.color];
          const Icon = card.icon;
          return (
            <Card key={card.title} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
                  {card.change && (
                    <div className="mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">{card.change}</span>
                      <span className="text-xs text-gray-400">{card.subtitle}</span>
                    </div>
                  )}
                  {!card.change && <p className="mt-2 text-xs text-gray-400">{card.subtitle}</p>}
                </div>
                <div className={'rounded-lg p-2.5 ' + colors.icon}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card padding="md" className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">주간 매출 현황</h2>
          <p className="mb-6 text-sm text-gray-500">최근 7일 매출 추이</p>
          <div className="flex items-end justify-between gap-3" style={{ height: 200 }}>
            {weeklyRevenue.map((item) => (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  {(item.amount / 10000).toLocaleString()}만
                </span>
                <div
                  className="w-full rounded-t-md bg-blue-500 transition-all hover:bg-blue-600"
                  style={{ height: item.height + '%', minHeight: 8 }}
                />
                <span className="text-xs text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900">전환율</h2>
          <p className="mb-6 text-sm text-gray-500">견적 &rarr; 예약 전환율</p>
          <div className="flex flex-col items-center justify-center">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" strokeDasharray={dashArray} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{conversionRate}%</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              이번 주 견적 요청 <span className="font-semibold text-gray-900">87건</span> 중{' '}
              <span className="font-semibold text-blue-600">20건</span> 예약 확정
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Pending Approvals */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card padding="none" className="xl:col-span-2">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">최근 견적 요청</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">번호</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">고객명</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">노선</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">차량</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{q.id}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.customer}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.route}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.vehicle}</td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge variant={statusBadge[q.status]?.variant || 'default'} size="sm" dot>
                        {statusBadge[q.status]?.label || q.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-500">{q.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card padding="none">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">기사 승인 대기</h2>
              <Badge variant="danger" size="sm">{drivers.length}건</Badge>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {drivers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <CheckCircle className="mb-2 h-8 w-8" />
                <p className="text-sm">대기 중인 승인 요청이 없습니다.</p>
              </div>
            )}
            {drivers.map((driver) => (
              <div key={driver.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <p className="text-sm text-gray-500">{driver.company}</p>
                    <p className="text-xs text-gray-400">{driver.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => handleApprove(driver.id)}>
                      <CheckCircle className="h-3.5 w-3.5" />
                      승인
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(driver.id)}>
                      <XCircle className="h-3.5 w-3.5" />
                      거절
                    </Button>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  신청일: {driver.appliedAt}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
