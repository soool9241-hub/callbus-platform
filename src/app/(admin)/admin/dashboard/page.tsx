'use client';

import { useState, useEffect } from 'react';
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
import { Spinner } from '@/components/ui/Spinner';
import { supabase } from '@/lib/supabase';

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', text: 'text-green-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', text: 'text-orange-600' },
};

const statusBadge: Record<string, { variant: 'info' | 'warning' | 'success' | 'default' | 'danger'; label: string }> = {
  'open': { variant: 'warning', label: '대기' },
  'in_progress': { variant: 'info', label: '견적접수' },
  'reserved': { variant: 'success', label: '예약확정' },
  'expired': { variant: 'default', label: '만료' },
  'cancelled': { variant: 'danger', label: '취소' },
  'completed': { variant: 'success', label: '완료' },
};

interface PendingDriver {
  id: string;
  company_name: string;
  created_at: string;
  profiles: { name: string; phone: string } | null;
}

interface RecentQuote {
  id: string;
  request_number: string;
  departure_address: string;
  destination_address: string;
  vehicle_type: string[];
  status: string;
  created_at: string;
  profiles: { name: string } | null;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [todayQuoteCount, setTodayQuoteCount] = useState(0);
  const [todayReservationCount, setTodayReservationCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [newSignupCount, setNewSignupCount] = useState(0);
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<PendingDriver[]>([]);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const todayStart = today + 'T00:00:00';
      const todayEnd = today + 'T23:59:59';

      // Fetch all data in parallel
      const [
        quoteCountRes,
        reservationCountRes,
        revenueRes,
        signupRes,
        recentQuotesRes,
        pendingDriversRes,
      ] = await Promise.all([
        // Today's quote requests count
        supabase
          .from('quote_requests')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd),
        // Today's reservations count
        supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd),
        // Today's revenue (sum of total_amount from reservations created today)
        supabase
          .from('reservations')
          .select('total_amount')
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd),
        // New signups today
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd),
        // Recent 5 quote requests
        supabase
          .from('quote_requests')
          .select('*, profiles!customer_id(name)')
          .order('created_at', { ascending: false })
          .limit(5),
        // Pending driver approvals
        supabase
          .from('drivers')
          .select('*, profiles!user_id(name, phone)')
          .eq('approval_status', 'pending')
          .order('created_at', { ascending: false }),
      ]);

      setTodayQuoteCount(quoteCountRes.count ?? 0);
      setTodayReservationCount(reservationCountRes.count ?? 0);
      const revenue = (revenueRes.data ?? []).reduce(
        (sum: number, r: any) => sum + (r.total_amount || 0),
        0
      );
      setTodayRevenue(revenue);
      setNewSignupCount(signupRes.count ?? 0);
      setRecentQuotes((recentQuotesRes.data as RecentQuote[]) ?? []);
      setPendingDrivers((pendingDriversRes.data as PendingDriver[]) ?? []);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (driverId: string) => {
    setApproving(driverId);
    try {
      await supabase
        .from('drivers')
        .update({ approval_status: 'approved' })
        .eq('id', driverId);
      setPendingDrivers((prev) => prev.filter((d) => d.id !== driverId));
    } catch (err) {
      console.error('Approve error:', err);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (driverId: string) => {
    setApproving(driverId);
    try {
      await supabase
        .from('drivers')
        .update({ approval_status: 'rejected' })
        .eq('id', driverId);
      setPendingDrivers((prev) => prev.filter((d) => d.id !== driverId));
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setApproving(null);
    }
  };

  const formatCurrency = (amount: number) =>
    '\u20A9' + amount.toLocaleString('ko-KR');

  const summaryCards = [
    {
      title: '오늘 견적 요청',
      value: todayQuoteCount + '건',
      color: 'blue' as const,
      icon: FileText,
    },
    {
      title: '오늘 예약 확정',
      value: todayReservationCount + '건',
      color: 'green' as const,
      icon: CalendarCheck,
    },
    {
      title: '오늘 거래액',
      value: formatCurrency(todayRevenue),
      color: 'purple' as const,
      icon: DollarSign,
    },
    {
      title: '신규 가입',
      value: newSignupCount + '명',
      color: 'orange' as const,
      icon: UserPlus,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

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
                </div>
                <div className={'rounded-lg p-2.5 ' + colors.icon}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
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
                {recentQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <FileText className="mx-auto mb-2 h-8 w-8" />
                      데이터가 없습니다
                    </td>
                  </tr>
                ) : (
                  recentQuotes.map((q) => {
                    const dep = q.departure_address?.split(' ').slice(0, 2).join(' ') || '';
                    const dest = q.destination_address?.split(' ').slice(0, 2).join(' ') || '';
                    const route = dep + ' \u2192 ' + dest;
                    const vehicleLabel = (q.vehicle_type ?? []).join(', ') || '-';
                    const badge = statusBadge[q.status] ?? { variant: 'default' as const, label: q.status };
                    return (
                      <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">
                          {q.request_number || q.id.slice(0, 8)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                          {(q.profiles as any)?.name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-700">{route}</td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-700">{vehicleLabel}</td>
                        <td className="whitespace-nowrap px-6 py-3">
                          <Badge variant={badge.variant} size="sm" dot>
                            {badge.label}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-500">
                          {new Date(q.created_at).toLocaleString('ko-KR')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card padding="none">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">기사 승인 대기</h2>
              <Badge variant="danger" size="sm">{pendingDrivers.length}건</Badge>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingDrivers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <CheckCircle className="mb-2 h-8 w-8" />
                <p className="text-sm">대기 중인 승인 요청이 없습니다.</p>
              </div>
            )}
            {pendingDrivers.map((driver) => (
              <div key={driver.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {(driver.profiles as any)?.name || '-'}
                    </p>
                    <p className="text-sm text-gray-500">{driver.company_name || '-'}</p>
                    <p className="text-xs text-gray-400">
                      {(driver.profiles as any)?.phone || '-'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleApprove(driver.id)}
                      disabled={approving === driver.id}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(driver.id)}
                      disabled={approving === driver.id}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      거절
                    </Button>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  신청일: {new Date(driver.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
