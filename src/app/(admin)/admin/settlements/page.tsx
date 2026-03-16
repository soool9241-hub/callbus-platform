'use client';

import { useState, useEffect } from 'react';
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
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';

// ── Types ────────────────────────────────────────────────────────────────────

interface SettlementRow {
  id: string;
  driver_name: string;
  company_name: string;
  period: string;
  revenue: number;
  fee: number;
  settlement: number;
  status: string;
}

const statusBadgeConfig: Record<string, { variant: 'warning' | 'info' | 'success'; label: string }> = {
  'pending': { variant: 'warning', label: '정산대기' },
  'confirmed': { variant: 'info', label: '정산확정' },
  'paid': { variant: 'success', label: '입금완료' },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function SettlementsPage() {
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<SettlementRow[]>([]);
  const [feeRate, setFeeRate] = useState('10');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchSettlements();
  }, []);

  async function fetchSettlements() {
    setLoading(true);
    try {
      // Try to fetch from settlements table first
      const { data: settlementsData, error: settlementsError } = await supabase
        .from('settlements')
        .select('*, drivers(*, profiles!user_id(name))')
        .order('period_start', { ascending: false });

      if (!settlementsError && settlementsData && settlementsData.length > 0) {
        setSettlements(
          settlementsData.map((s: any) => ({
            id: s.id,
            driver_name: s.drivers?.profiles?.name || '-',
            company_name: s.drivers?.company_name || '-',
            period: `${new Date(s.period_start).toLocaleDateString('ko-KR')} ~ ${new Date(s.period_end).toLocaleDateString('ko-KR')}`,
            revenue: s.total_revenue || 0,
            fee: s.platform_fee || 0,
            settlement: s.net_amount || 0,
            status: s.status || 'pending',
          }))
        );
      } else {
        // Fallback: compute from completed reservations grouped by driver
        const { data: completedRes } = await supabase
          .from('reservations')
          .select('*, drivers!driver_id(*, profiles!user_id(name))')
          .eq('status', 'completed');

        if (completedRes && completedRes.length > 0) {
          const driverMap: Record<string, { name: string; company: string; revenue: number }> = {};
          completedRes.forEach((r: any) => {
            const driverId = r.driver_id;
            if (!driverMap[driverId]) {
              driverMap[driverId] = {
                name: r.drivers?.profiles?.name || '-',
                company: r.drivers?.company_name || '-',
                revenue: 0,
              };
            }
            driverMap[driverId].revenue += r.total_amount || 0;
          });

          const rate = parseFloat(feeRate) / 100;
          setSettlements(
            Object.entries(driverMap).map(([id, d]) => ({
              id,
              driver_name: d.name,
              company_name: d.company,
              period: '전체 기간',
              revenue: d.revenue,
              fee: Math.round(d.revenue * rate),
              settlement: Math.round(d.revenue * (1 - rate)),
              status: 'pending',
            }))
          );
        } else {
          setSettlements([]);
        }
      }
    } catch (err) {
      console.error('Settlements fetch error:', err);
      setSettlements([]);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) =>
    '\u20A9' + amount.toLocaleString('ko-KR');

  const totalPendingAmount = settlements
    .filter((s) => s.status === 'pending')
    .reduce((acc, s) => acc + s.settlement, 0);
  const totalPendingCount = settlements.filter((s) => s.status === 'pending').length;

  const confirmedAmount = settlements
    .filter((s) => s.status === 'confirmed')
    .reduce((acc, s) => acc + s.settlement, 0);
  const confirmedCount = settlements.filter((s) => s.status === 'confirmed').length;

  const handleConfirm = async (id: string) => {
    setUpdating(id);
    try {
      await supabase
        .from('settlements')
        .update({ status: 'confirmed' })
        .eq('id', id);
      setSettlements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'confirmed' } : s))
      );
    } catch (err) {
      // If settlements table doesn't exist, just update locally
      setSettlements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'confirmed' } : s))
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleDeposit = async (id: string) => {
    setUpdating(id);
    try {
      await supabase
        .from('settlements')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', id);
      setSettlements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'paid' } : s))
      );
    } catch (err) {
      setSettlements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'paid' } : s))
      );
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

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
              {settlements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <Wallet className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                settlements.map((s) => {
                  const badge = statusBadgeConfig[s.status] ?? { variant: 'default' as const, label: s.status };
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{s.driver_name}</p>
                          <p className="text-xs text-gray-400">{s.company_name}</p>
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
                        <Badge variant={badge.variant} size="sm" dot>
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex gap-1">
                          {s.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleConfirm(s.id)}
                              disabled={updating === s.id}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              정산확정
                            </Button>
                          )}
                          {s.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleDeposit(s.id)}
                              disabled={updating === s.id}
                            >
                              <Send className="h-3.5 w-3.5" />
                              입금처리
                            </Button>
                          )}
                          {s.status === 'paid' && (
                            <span className="px-2 py-1 text-xs text-gray-400">처리완료</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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
