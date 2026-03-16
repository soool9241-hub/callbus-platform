'use client';

import { useState, useEffect } from 'react';
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
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';
import { getDriverByUserId } from '@/lib/supabase-db';

// ── Types ────────────────────────────────────────────────────────────────

interface SettlementRecord {
  id: string;
  period: string;
  tripCount: number;
  totalRevenue: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'confirmed' | 'paid';
}

interface TripRecord {
  id: string;
  date: string;
  route: string;
  customerName: string;
  amount: number;
  status: 'completed' | 'pending' | 'settled';
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

function getStatusBadge(status: SettlementRecord['status']) {
  switch (status) {
    case 'pending':
      return <Badge variant="warning" size="sm" dot>대기</Badge>;
    case 'confirmed':
      return <Badge variant="info" size="sm" dot>확정</Badge>;
    case 'paid':
      return <Badge variant="success" size="sm" dot>입금완료</Badge>;
  }
}

function getTripStatusBadge(status: TripRecord['status']) {
  switch (status) {
    case 'completed':
      return <Badge variant="default" size="sm">완료</Badge>;
    case 'pending':
      return <Badge variant="warning" size="sm">정산대기</Badge>;
    case 'settled':
      return <Badge variant="success" size="sm">정산완료</Badge>;
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
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<SettlementRecord[]>([]);
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [tripCount, setTripCount] = useState(0);

  const { user } = useAuth();
  const { currentUser } = useStore();

  useEffect(() => {
    fetchSettlementData();
  }, [user, currentUser, selectedMonth]);

  async function fetchSettlementData() {
    setLoading(true);
    try {
      const userId = user?.id || currentUser?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      // Get driver record
      const { data: driver } = await getDriverByUserId(userId);
      if (!driver) {
        setLoading(false);
        return;
      }

      const driverId = driver.id;
      const feeRate = 0.1;

      // Fetch completed reservations for this driver
      const { data: reservationsData } = await supabase
        .from('reservations')
        .select('*, quotes(*, quote_requests(departure_address, destination_address)), profiles!customer_id(name)')
        .eq('driver_id', driverId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      const completedReservations = reservationsData ?? [];

      // Filter by selected month
      const [year, month] = selectedMonth.split('-').map(Number);
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0, 23, 59, 59);

      const monthReservations = completedReservations.filter((r: any) => {
        const d = new Date(r.created_at);
        return d >= monthStart && d <= monthEnd;
      });

      // Calculate summary
      const total = monthReservations.reduce((sum: number, r: any) => sum + (r.total_amount || 0), 0);
      const fee = Math.round(total * feeRate);
      const net = total - fee;

      setTotalRevenue(total);
      setPlatformFee(fee);
      setNetAmount(net);
      setTripCount(monthReservations.length);

      // Build trip records
      setTrips(
        monthReservations.map((r: any) => {
          const qr = r.quotes?.quote_requests;
          const dep = qr?.departure_address?.split(' ').slice(0, 2).join(' ') || '';
          const dest = qr?.destination_address?.split(' ').slice(0, 2).join(' ') || '';
          return {
            id: r.id,
            date: r.created_at,
            route: dep + ' \u2192 ' + dest,
            customerName: r.profiles?.name || '-',
            amount: r.total_amount || 0,
            status: 'settled' as const,
          };
        })
      );

      // Try to fetch settlement records from settlements table
      const { data: settlementData } = await supabase
        .from('settlements')
        .select('*')
        .eq('driver_id', driverId)
        .order('period_start', { ascending: false });

      if (settlementData && settlementData.length > 0) {
        setSettlements(
          settlementData.map((s: any) => ({
            id: s.id,
            period: `${new Date(s.period_start).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })} ~ ${new Date(s.period_end).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}`,
            tripCount: s.trip_count || 0,
            totalRevenue: s.total_revenue || 0,
            platformFee: s.platform_fee || 0,
            netAmount: s.net_amount || 0,
            status: s.status === 'paid' ? 'paid' : s.status === 'confirmed' ? 'confirmed' : 'pending',
          }))
        );
      } else {
        // Generate settlement records from completed reservations
        if (monthReservations.length > 0) {
          // Split into two half-month periods
          const midMonth = new Date(year, month - 1, 16);
          const firstHalf = monthReservations.filter((r: any) => new Date(r.created_at) < midMonth);
          const secondHalf = monthReservations.filter((r: any) => new Date(r.created_at) >= midMonth);

          const genSettlement = (items: any[], periodStr: string, idx: number): SettlementRecord | null => {
            if (items.length === 0) return null;
            const rev = items.reduce((s: number, r: any) => s + (r.total_amount || 0), 0);
            return {
              id: `gen-${idx}`,
              period: periodStr,
              tripCount: items.length,
              totalRevenue: rev,
              platformFee: Math.round(rev * feeRate),
              netAmount: Math.round(rev * (1 - feeRate)),
              status: 'pending',
            };
          };

          const results: SettlementRecord[] = [];
          const s1 = genSettlement(firstHalf, `${String(month).padStart(2, '0')}/01 ~ ${String(month).padStart(2, '0')}/15`, 1);
          const s2 = genSettlement(secondHalf, `${String(month).padStart(2, '0')}/16 ~ ${String(month).padStart(2, '0')}/${monthEnd.getDate()}`, 2);
          if (s1) results.push(s1);
          if (s2) results.push(s2);
          setSettlements(results);
        } else {
          setSettlements([]);
        }
      }
    } catch (err) {
      console.error('Settlement data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card hover>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">이번 달 총 매출</p>
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
            <p className="text-sm text-gray-600 mb-1">수수료 (10%)</p>
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
            <p className="text-sm text-gray-600 mb-1">정산 예정액</p>
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
            <p className="text-sm text-gray-600 mb-1">운행 건수</p>
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

          {settlements.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Wallet className="mx-auto mb-2 h-8 w-8" />
              <p>데이터가 없습니다</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </Card>

      {/* Individual Trip List */}
      <Card>
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            개별 운행 내역
          </h2>

          {trips.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Calendar className="mx-auto mb-2 h-8 w-8" />
              <p>데이터가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-600">
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
                  <div className="text-right sm:ml-4 shrink-0">
                    <p className="text-base font-semibold text-gray-900">
                      {formatCurrency(trip.amount)}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {trips.length > 0 && (
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
          )}
        </div>
      </Card>
    </div>
  );
}
