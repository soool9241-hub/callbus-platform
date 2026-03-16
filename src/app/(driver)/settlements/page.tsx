'use client';

import { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  Percent,
  CreditCard,
  Truck,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

// Local settlement mock data for driver-facing page
interface SettlementRecord {
  id: string;
  period: string;
  tripCount: number;
  totalRevenue: number;
  platformFee: number;
  netAmount: number;
  status: '대기' | '확정' | '입금완료';
}

interface TripRecord {
  id: string;
  date: string;
  route: string;
  customerName: string;
  amount: number;
  status: '완료' | '정산대기' | '정산완료';
}

const settlements: SettlementRecord[] = [
  {
    id: 's-001',
    period: '03/01 ~ 03/15',
    tripCount: 3,
    totalRevenue: 2100000,
    platformFee: 210000,
    netAmount: 1890000,
    status: '입금완료',
  },
  {
    id: 's-002',
    period: '03/16 ~ 03/31',
    tripCount: 2,
    totalRevenue: 1350000,
    platformFee: 135000,
    netAmount: 1215000,
    status: '확정',
  },
  {
    id: 's-003',
    period: '02/01 ~ 02/15',
    tripCount: 4,
    totalRevenue: 2800000,
    platformFee: 280000,
    netAmount: 2520000,
    status: '입금완료',
  },
  {
    id: 's-004',
    period: '02/16 ~ 02/28',
    tripCount: 1,
    totalRevenue: 500000,
    platformFee: 50000,
    netAmount: 450000,
    status: '입금완료',
  },
];

const trips: TripRecord[] = [
  {
    id: 't-001',
    date: '2026-03-05',
    route: '서울 강남 → 속초 해수욕장',
    customerName: '김민수',
    amount: 850000,
    status: '정산완료',
  },
  {
    id: 't-002',
    date: '2026-03-08',
    route: '서울 광화문 → 용인 에버랜드',
    customerName: '이서연',
    amount: 650000,
    status: '정산완료',
  },
  {
    id: 't-003',
    date: '2026-03-12',
    route: '서울 잠실 → 대전 유성구',
    customerName: '김민수',
    amount: 600000,
    status: '정산완료',
  },
  {
    id: 't-004',
    date: '2026-03-18',
    route: '서울 서초 → 경주 보문단지',
    customerName: '이서연',
    amount: 750000,
    status: '정산대기',
  },
  {
    id: 't-005',
    date: '2026-03-22',
    route: '서울 마포 → 전주 한옥마을',
    customerName: '김민수',
    amount: 600000,
    status: '정산대기',
  },
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

function getStatusBadge(status: SettlementRecord['status']) {
  switch (status) {
    case '대기':
      return <Badge variant="warning" size="sm" dot>{status}</Badge>;
    case '확정':
      return <Badge variant="info" size="sm" dot>{status}</Badge>;
    case '입금완료':
      return <Badge variant="success" size="sm" dot>{status}</Badge>;
  }
}

function getTripStatusBadge(status: TripRecord['status']) {
  switch (status) {
    case '완료':
      return <Badge variant="default" size="sm">{status}</Badge>;
    case '정산대기':
      return <Badge variant="warning" size="sm">{status}</Badge>;
    case '정산완료':
      return <Badge variant="success" size="sm">{status}</Badge>;
  }
}

const monthOptions = [
  { value: '2026-03', label: '2026년 3월' },
  { value: '2026-02', label: '2026년 2월' },
  { value: '2026-01', label: '2026년 1월' },
  { value: '2025-12', label: '2025년 12월' },
];

export default function SettlementsPage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

  // Summary for current month (March)
  const totalRevenue = 3450000;
  const feeRate = 0.1;
  const platformFee = totalRevenue * feeRate;
  const netAmount = totalRevenue - platformFee;
  const tripCount = 5;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">정산 내역</h1>
        <div className="w-48">
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card hover>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mb-1">이번 달 총 매출</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalRevenue)}<span className="text-base font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>

        <Card hover>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Percent className="w-5 h-5 text-red-600" />
              </div>
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-sm text-gray-500 mb-1">수수료 (10%)</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(platformFee)}<span className="text-base font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>

        <Card hover>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">정산 예정액</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(netAmount)}<span className="text-base font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>

        <Card hover>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">운행 건수</p>
            <p className="text-2xl font-bold text-gray-900">
              {tripCount}<span className="text-base font-normal text-gray-500">건</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Settlement Table */}
      <Card className="mb-8">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            정산 기간별 내역
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">기간</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">운행 건수</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">총 매출</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">플랫폼 수수료</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">정산액</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500">상태</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{s.period}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{s.tripCount}건</td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(s.totalRevenue)}원
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      -{formatCurrency(s.platformFee)}원
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {formatCurrency(s.netAmount)}원
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(s.status)}</td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {settlements.map((s) => (
              <div
                key={s.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{s.period}</span>
                  {getStatusBadge(s.status)}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">운행:</span>{' '}
                    <span className="text-gray-900">{s.tripCount}건</span>
                  </div>
                  <div>
                    <span className="text-gray-500">매출:</span>{' '}
                    <span className="text-gray-900">{formatCurrency(s.totalRevenue)}원</span>
                  </div>
                  <div>
                    <span className="text-gray-500">수수료:</span>{' '}
                    <span className="text-red-600">-{formatCurrency(s.platformFee)}원</span>
                  </div>
                  <div>
                    <span className="text-gray-500">정산:</span>{' '}
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(s.netAmount)}원
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Individual Trip List */}
      <Card>
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            개별 운행 내역
          </h2>

          <div className="space-y-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-500">
                      {formatDate(trip.date)}
                    </span>
                    {getTripStatusBadge(trip.status)}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {trip.route}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    고객: {trip.customerName}
                  </p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className="text-base font-semibold text-gray-900">
                    {formatCurrency(trip.amount)}원
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                총 {trips.length}건
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(trips.reduce((sum, t) => sum + t.amount, 0))}원
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
