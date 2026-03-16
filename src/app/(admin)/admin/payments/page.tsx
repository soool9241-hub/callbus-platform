'use client';

import { useState } from 'react';
import { CreditCard, DollarSign, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

interface Payment {
  id: string;
  orderId: string;
  reservationNo: string;
  customer: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
}

const mockPayments: Payment[] = [
  { id: '1', orderId: 'ORD-20260317-001', reservationNo: 'RSV-2026-1042', customer: '김철수', amount: 850000, method: '카드', status: 'completed', date: '2026-03-17 14:30' },
  { id: '2', orderId: 'ORD-20260317-002', reservationNo: 'RSV-2026-1043', customer: '이영미', amount: 1200000, method: '카드', status: 'completed', date: '2026-03-17 13:15' },
  { id: '3', orderId: 'ORD-20260317-003', reservationNo: 'RSV-2026-1044', customer: '박지은', amount: 320000, method: '계좌이체', status: 'pending', date: '2026-03-17 12:00' },
  { id: '4', orderId: 'ORD-20260316-004', reservationNo: 'RSV-2026-1038', customer: '최민호', amount: 950000, method: '카드', status: 'refunded', date: '2026-03-16 18:20' },
  { id: '5', orderId: 'ORD-20260316-005', reservationNo: 'RSV-2026-1039', customer: '정수현', amount: 450000, method: '간편결제', status: 'completed', date: '2026-03-16 16:45' },
  { id: '6', orderId: 'ORD-20260316-006', reservationNo: 'RSV-2026-1040', customer: '한지영', amount: 680000, method: '카드', status: 'failed', date: '2026-03-16 15:30' },
  { id: '7', orderId: 'ORD-20260315-007', reservationNo: 'RSV-2026-1035', customer: '윤서준', amount: 1500000, method: '카드', status: 'completed', date: '2026-03-15 11:00' },
  { id: '8', orderId: 'ORD-20260315-008', reservationNo: 'RSV-2026-1036', customer: '강예진', amount: 270000, method: '간편결제', status: 'completed', date: '2026-03-15 10:20' },
  { id: '9', orderId: 'ORD-20260314-009', reservationNo: 'RSV-2026-1030', customer: '임도현', amount: 780000, method: '계좌이체', status: 'pending', date: '2026-03-14 09:15' },
  { id: '10', orderId: 'ORD-20260314-010', reservationNo: 'RSV-2026-1031', customer: '송하늘', amount: 560000, method: '카드', status: 'completed', date: '2026-03-14 08:00' },
];

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
  completed: { variant: 'success', label: '완료' },
  pending: { variant: 'warning', label: '대기' },
  failed: { variant: 'danger', label: '실패' },
  refunded: { variant: 'default', label: '환불' },
};

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('2026-03-01');
  const [dateTo, setDateTo] = useState('2026-03-17');

  const filtered = mockPayments.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const totalTransactions = filtered.length;
  const totalAmount = filtered.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const refundAmount = filtered.filter((p) => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">결제 내역</h1>
        <p className="mt-1 text-sm text-gray-500">결제 트랜잭션을 조회하고 관리합니다.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 거래건수</p>
              <p className="text-xl font-bold text-gray-900">{totalTransactions}건</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2.5 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 결제금액</p>
              <p className="text-xl font-bold text-gray-900">{totalAmount.toLocaleString()}원</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2.5 text-red-600">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">환불 금액</p>
              <p className="text-xl font-bold text-gray-900">{refundAmount.toLocaleString()}원</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <span className="text-gray-400">~</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="w-40">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: '전체 상태' },
              { value: 'completed', label: '완료' },
              { value: 'pending', label: '대기' },
              { value: 'failed', label: '실패' },
              { value: 'refunded', label: '환불' },
            ]}
          />
        </div>
      </div>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">주문번호</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">예약번호</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">고객</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">금액</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">결제수단</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <CreditCard className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const sc = statusConfig[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3 font-mono text-sm font-medium text-gray-900">{p.orderId}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.reservationNo}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.customer}</td>
                      <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{p.amount.toLocaleString()}원</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.method}</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500">{p.date}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => {
          const sc = statusConfig[p.status];
          return (
            <Card key={p.id} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-sm font-medium text-gray-900">{p.orderId}</p>
                  <p className="text-sm text-gray-500">{p.customer} / {p.reservationNo}</p>
                </div>
                <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{p.amount.toLocaleString()}원</span>
                <span className="text-sm text-gray-500">{p.method}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{p.date}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
