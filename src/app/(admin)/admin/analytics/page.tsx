'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, FileText, Users, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const kpiCards = [
  { title: '월간 거래액', value: '4억 2,300만원', change: '+12.5%', icon: DollarSign, color: 'blue' },
  { title: '월간 견적수', value: '1,847건', change: '+8.3%', icon: FileText, color: 'green' },
  { title: '견적→예약 전환율', value: '34.2%', change: '+2.1%', icon: TrendingUp, color: 'purple' },
  { title: 'MAU', value: '12,450명', change: '+15.7%', icon: Users, color: 'orange' },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600' },
};

const monthlyRevenue = [
  { month: '10월', value: 32000, max: 45000 },
  { month: '11월', value: 28000, max: 45000 },
  { month: '12월', value: 38000, max: 45000 },
  { month: '1월', value: 35000, max: 45000 },
  { month: '2월', value: 40000, max: 45000 },
  { month: '3월', value: 42300, max: 45000 },
];

const vehicleRevenue = [
  { type: '25인승 소형', amount: 18500, percentage: 43.7, color: 'bg-[#1B6FF4]' },
  { type: '45인승 대형', amount: 14200, percentage: 33.6, color: 'bg-[#FF6B35]' },
  { type: '12인승 미니', amount: 5800, percentage: 13.7, color: 'bg-[#10B981]' },
  { type: '기타', amount: 3800, percentage: 9.0, color: 'bg-gray-400' },
];

const regionDemand = [
  { region: '강원도', count: 542, percentage: 29.3 },
  { region: '경기도', count: 428, percentage: 23.2 },
  { region: '제주도', count: 312, percentage: 16.9 },
  { region: '경상남도', count: 278, percentage: 15.0 },
  { region: '충청남도', count: 187, percentage: 10.1 },
  { region: '기타', count: 100, percentage: 5.5 },
];

const packageConversion = [
  { name: '속초 힐링 2박3일', views: 3200, bookings: 145, rate: 4.5 },
  { name: '거제도 바다여행', views: 2800, bookings: 98, rate: 3.5 },
  { name: '가평 글램핑 체험', views: 2100, bookings: 112, rate: 5.3 },
  { name: '제주 풀빌라 프리미엄', views: 1900, bookings: 67, rate: 3.5 },
  { name: '양양 서핑+숙박', views: 1500, bookings: 89, rate: 5.9 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({ from: '2026-03-01', to: '2026-03-17' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">통계/분석</h1>
          <p className="mt-1 text-sm text-gray-500">서비스 운영 지표를 분석합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <span className="text-gray-400">~</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const colors = colorMap[card.color];
          const Icon = card.icon;
          return (
            <Card key={card.title} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {card.change}
                  </div>
                </div>
                <div className={'rounded-lg p-2.5 ' + colors.icon}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Monthly Revenue */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">월별 거래액 추이</h2>
          <div className="flex items-end justify-between gap-3" style={{ height: 200 }}>
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-gray-500">{(m.value / 10000).toFixed(1)}억</span>
                <div className="w-full relative" style={{ height: 160 }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-[#1B6FF4] transition-all"
                    style={{ height: `${(m.value / m.max) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Vehicle Type Revenue */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">차량타입별 매출 비중</h2>
          <div className="space-y-4">
            {vehicleRevenue.map((v) => (
              <div key={v.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{v.type}</span>
                  <span className="text-sm text-gray-500">{v.amount.toLocaleString()}만원 ({v.percentage}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-3 rounded-full ${v.color} transition-all`}
                    style={{ width: `${v.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Demand */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">지역별 수요</h2>
          <div className="space-y-3">
            {regionDemand.map((r) => (
              <div key={r.region} className="flex items-center gap-4">
                <span className="w-20 text-sm font-medium text-gray-700">{r.region}</span>
                <div className="flex-1">
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2.5 rounded-full bg-[#1B6FF4] transition-all"
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right text-sm text-gray-500">{r.count}건</span>
                <span className="w-12 text-right text-sm text-gray-400">{r.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Package Conversion */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">패키지 전환율</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left font-medium text-gray-500">패키지명</th>
                  <th className="pb-3 text-right font-medium text-gray-500">조회수</th>
                  <th className="pb-3 text-right font-medium text-gray-500">예약수</th>
                  <th className="pb-3 text-right font-medium text-gray-500">전환율</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {packageConversion.map((p) => (
                  <tr key={p.name}>
                    <td className="py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="py-3 text-right text-gray-700">{p.views.toLocaleString()}</td>
                    <td className="py-3 text-right text-gray-700">{p.bookings}</td>
                    <td className="py-3 text-right">
                      <span className={`font-medium ${p.rate >= 5 ? 'text-green-600' : p.rate >= 4 ? 'text-blue-600' : 'text-gray-600'}`}>
                        {p.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
