'use client';

import { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  Percent,
  CreditCard,
  Package,
  Navigation,
  FileText,
  Calendar,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

const monthOptions = [
  { value: '2026-03', label: '2026년 3월' },
  { value: '2026-02', label: '2026년 2월' },
  { value: '2026-01', label: '2026년 1월' },
  { value: '2025-12', label: '2025년 12월' },
];

const mockSummary = {
  packageRevenue: 6285000,
  shuttleRevenue: 1425000,
  proxyCommission: 120000,
  totalRevenue: 7830000,
  platformFee: 783000,
  netSettlement: 7047000,
};

const mockTransactions = [
  {
    id: 'tx-001',
    date: '2026-03-18',
    type: 'package' as const,
    description: '가평 힐링 1박2일 패키지 - 김민수',
    amount: 2225000,
    status: 'settled' as const,
  },
  {
    id: 'tx-002',
    date: '2026-03-17',
    type: 'shuttle' as const,
    description: '서울↔가평 주말 셔틀 - 3건',
    amount: 675000,
    status: 'settled' as const,
  },
  {
    id: 'tx-003',
    date: '2026-03-15',
    type: 'package' as const,
    description: '속초 바다 워크숍 패키지 - 최영호',
    amount: 4060000,
    status: 'pending' as const,
  },
  {
    id: 'tx-004',
    date: '2026-03-14',
    type: 'shuttle' as const,
    description: '서울↔가평 주말 셔틀 - 5건',
    amount: 750000,
    status: 'settled' as const,
  },
  {
    id: 'tx-005',
    date: '2026-03-12',
    type: 'proxy' as const,
    description: '대리 견적 수수료 - 박서연',
    amount: 120000,
    status: 'settled' as const,
  },
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
      return <Badge variant="warning" size="sm">대리</Badge>;
    default:
      return <Badge variant="default" size="sm">{type}</Badge>;
  }
}

export default function SettlementsPage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-03');

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">정산 내역</h1>
        <div className="w-full sm:w-48">
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card hover>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">패키지 수입</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(mockSummary.packageRevenue)}
              <span className="text-sm font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>

        <Card hover>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-[#1B6FF4]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">셔틀 수입</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(mockSummary.shuttleRevenue)}
              <span className="text-sm font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>

        <Card hover>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#FF6B35]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">대리 수수료</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(mockSummary.proxyCommission)}
              <span className="text-sm font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>

        <Card hover>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
            </div>
            <p className="text-sm text-gray-600 mb-1">총 수입</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(mockSummary.totalRevenue)}
              <span className="text-sm font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>

        <Card hover>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Percent className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">플랫폼 수수료 (10%)</p>
            <p className="text-xl font-bold text-red-600">
              -{formatCurrency(mockSummary.platformFee)}
              <span className="text-sm font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>

        <Card hover>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#1B6FF4]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">실 정산액</p>
            <p className="text-xl font-bold text-[#1B6FF4]">
              {formatCurrency(mockSummary.netSettlement)}
              <span className="text-sm font-normal text-gray-500">원</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#1B6FF4]" />
            거래 내역
          </h2>

          <div className="space-y-3">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-500">{tx.date}</span>
                    {getTypeBadge(tx.type)}
                    <Badge
                      variant={tx.status === 'settled' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {tx.status === 'settled' ? '정산완료' : '정산대기'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {tx.description}
                  </p>
                </div>
                <div className="text-right sm:ml-4 shrink-0">
                  <p className="text-base font-semibold text-gray-900">
                    {formatCurrency(tx.amount)}원
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                총 {mockTransactions.length}건
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(mockTransactions.reduce((sum, t) => sum + t.amount, 0))}원
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
