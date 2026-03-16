'use client';

import { useState } from 'react';
import {
  Wallet,
  CheckCircle,
  Send,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// ── Types ────────────────────────────────────────────────────────────────────

type SettlementStatus = '정산대기' | '정산확정' | '입금완료';

interface Settlement {
  id: number;
  driver: string;
  company: string;
  period: string;
  revenue: number;
  fee: number;
  settlement: number;
  status: SettlementStatus;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockSettlements: Settlement[] = [
  {
    id: 1,
    driver: '한승우',
    company: '대한관광',
    period: '2026-03-01 ~ 2026-03-15',
    revenue: 2850000,
    fee: 285000,
    settlement: 2565000,
    status: '정산대기',
  },
  {
    id: 2,
    driver: '윤서현',
    company: '코리아버스',
    period: '2026-03-01 ~ 2026-03-15',
    revenue: 3420000,
    fee: 342000,
    settlement: 3078000,
    status: '정산확정',
  },
  {
    id: 3,
    driver: '오지훈',
    company: '서울고속',
    period: '2026-03-01 ~ 2026-03-15',
    revenue: 1580000,
    fee: 158000,
    settlement: 1422000,
    status: '입금완료',
  },
  {
    id: 4,
    driver: '한승우',
    company: '대한관광',
    period: '2026-02-16 ~ 2026-02-28',
    revenue: 4100000,
    fee: 410000,
    settlement: 3690000,
    status: '입금완료',
  },
  {
    id: 5,
    driver: '윤서현',
    company: '코리아버스',
    period: '2026-02-16 ~ 2026-02-28',
    revenue: 5200000,
    fee: 520000,
    settlement: 4680000,
    status: '입금완료',
  },
];

const statusBadge: Record<SettlementStatus, { variant: 'warning' | 'info' | 'success'; label: string }> = {
  '정산대기': { variant: 'warning', label: '정산대기' },
  '정산확정': { variant: 'info', label: '정산확정' },
  '입금완료': { variant: 'success', label: '입금완료' },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>(mockSettlements);
  const [feeRate, setFeeRate] = useState('10');

  const formatCurrency = (amount: number) =>
    '\u20A9' + amount.toLocaleString('ko-KR');

  const totalPendingAmount = settlements
    .filter((s) => s.status === '정산대기')
    .reduce((acc, s) => acc + s.settlement, 0);
  const totalPendingCount = settlements.filter((s) => s.status === '정산대기').length;

  const confirmedAmount = settlements
    .filter((s) => s.status === '정산확정')
    .reduce((acc, s) => acc + s.settlement, 0);
  const confirmedCount = settlements.filter((s) => s.status === '정산확정').length;

  const handleConfirm = (id: number) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: '정산확정' as SettlementStatus } : s))
    );
  };

  const handleDeposit = (id: number) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: '입금완료' as SettlementStatus } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정산 관리</h1>
        <p className="mt-1 text-sm text-gray-500">기사 정산 현황을 관리합니다.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">이번 주기 정산 대기</p>
              <p className="mt-2 text-2xl font-bold text-orange-600">{formatCurrency(totalPendingAmount)}</p>
              <p className="mt-1 text-sm text-gray-400">{totalPendingCount}건</p>
            </div>
            <div className="rounded-lg bg-orange-100 p-2.5 text-orange-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">정산 확정 (입금 예정)</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">{formatCurrency(confirmedAmount)}</p>
              <p className="mt-1 text-sm text-gray-400">{confirmedCount}건</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">적용 수수료율</p>
              <p className="mt-2 text-2xl font-bold text-purple-600">{feeRate}%</p>
              <p className="mt-1 text-sm text-gray-400">플랫폼 수수료</p>
            </div>
            <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Settlement Table */}
      <Card padding="none">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">정산 내역</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">기사명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">정산기간</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">매출</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">수수료</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">정산액</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {settlements.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{s.driver}</p>
                      <p className="text-xs text-gray-400">{s.company}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{s.period}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-900">
                    {formatCurrency(s.revenue)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right text-red-500">
                    -{formatCurrency(s.fee)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right font-bold text-blue-600">
                    {formatCurrency(s.settlement)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <Badge variant={statusBadge[s.status]?.variant || 'default'} size="sm" dot>
                      {statusBadge[s.status]?.label || s.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <div className="flex gap-1">
                      {s.status === '정산대기' && (
                        <Button size="sm" variant="primary" onClick={() => handleConfirm(s.id)}>
                          <CheckCircle className="h-3.5 w-3.5" />
                          정산확정
                        </Button>
                      )}
                      {s.status === '정산확정' && (
                        <Button size="sm" variant="primary" onClick={() => handleDeposit(s.id)}>
                          <Send className="h-3.5 w-3.5" />
                          입금처리
                        </Button>
                      )}
                      {s.status === '입금완료' && (
                        <span className="px-2 py-1 text-xs text-gray-400">처리완료</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Fee Rate Setting */}
      <Card padding="md">
        <h2 className="text-lg font-semibold text-gray-900">수수료율 설정</h2>
        <p className="mb-4 text-sm text-gray-500">플랫폼 수수료율을 설정합니다. 변경 시 다음 정산 주기부터 적용됩니다.</p>
        <div className="flex items-end gap-3">
          <div className="w-32">
            <Input
              label="수수료율 (%)"
              type="number"
              min="0"
              max="100"
              value={feeRate}
              onChange={(e) => setFeeRate(e.target.value)}
            />
          </div>
          <Button variant="primary">
            <CheckCircle className="h-4 w-4" />
            저장
          </Button>
        </div>
      </Card>
    </div>
  );
}
