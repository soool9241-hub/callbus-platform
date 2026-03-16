'use client';

import { useState } from 'react';
import { Building, DollarSign, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PensionSettlement {
  id: string;
  ownerName: string;
  pensionName: string;
  packageRevenue: number;
  shuttleRevenue: number;
  referralRevenue: number;
  total: number;
  fee: number;
  net: number;
  status: 'pending' | 'confirmed' | 'paid';
}

const mockSettlements: PensionSettlement[] = [
  { id: '1', ownerName: '김민수', pensionName: '솔바람 펜션', packageRevenue: 4500000, shuttleRevenue: 1200000, referralRevenue: 300000, total: 6000000, fee: 600000, net: 5400000, status: 'pending' },
  { id: '2', ownerName: '이영희', pensionName: '해오름 리조트', packageRevenue: 6800000, shuttleRevenue: 2100000, referralRevenue: 450000, total: 9350000, fee: 935000, net: 8415000, status: 'confirmed' },
  { id: '3', ownerName: '한소영', pensionName: '바다의정원', packageRevenue: 3200000, shuttleRevenue: 800000, referralRevenue: 150000, total: 4150000, fee: 415000, net: 3735000, status: 'paid' },
  { id: '4', ownerName: '최서윤', pensionName: '별빛 풀빌라', packageRevenue: 5100000, shuttleRevenue: 1500000, referralRevenue: 200000, total: 6800000, fee: 680000, net: 6120000, status: 'pending' },
  { id: '5', ownerName: '정태호', pensionName: '초록숲 글램핑', packageRevenue: 2800000, shuttleRevenue: 600000, referralRevenue: 100000, total: 3500000, fee: 350000, net: 3150000, status: 'confirmed' },
];

const statusConfig: Record<string, { variant: 'warning' | 'info' | 'success'; label: string }> = {
  pending: { variant: 'warning', label: '정산대기' },
  confirmed: { variant: 'info', label: '확정' },
  paid: { variant: 'success', label: '입금완료' },
};

export default function PensionSettlementsPage() {
  const [month, setMonth] = useState('2026-03');
  const [settlements, setSettlements] = useState<PensionSettlement[]>(mockSettlements);

  const totalPayout = settlements.reduce((sum, s) => sum + s.net, 0);
  const totalFees = settlements.reduce((sum, s) => sum + s.fee, 0);

  const handleConfirm = (id: string) => {
    setSettlements((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'confirmed' as const } : s)));
  };

  const handlePaid = (id: string) => {
    setSettlements((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'paid' as const } : s)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">펜션 정산</h1>
          <p className="mt-1 text-sm text-gray-500">펜션 파트너 정산을 관리합니다.</p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 펜션 지급액</p>
              <p className="text-xl font-bold text-gray-900">{totalPayout.toLocaleString()}원</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2.5 text-green-600">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">플랫폼 수수료 수입</p>
              <p className="text-xl font-bold text-gray-900">{totalFees.toLocaleString()}원</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">대표자</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">펜션명</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">패키지 매출</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">셔틀 매출</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">소개 수익</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">합계</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">수수료</th>
                <th className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-500">정산액</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {settlements.map((s) => {
                const sc = statusConfig[s.status];
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{s.ownerName}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{s.pensionName}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-gray-700">{s.packageRevenue.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-gray-700">{s.shuttleRevenue.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-gray-700">{s.referralRevenue.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-medium text-gray-900">{s.total.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-red-500">-{s.fee.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-bold text-[#1B6FF4]">{s.net.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex gap-1">
                        {s.status === 'pending' && (
                          <Button size="sm" variant="primary" onClick={() => handleConfirm(s.id)}>
                            <CheckCircle className="h-3.5 w-3.5" />확정
                          </Button>
                        )}
                        {s.status === 'confirmed' && (
                          <Button size="sm" variant="accent" onClick={() => handlePaid(s.id)}>
                            입금완료
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {settlements.map((s) => {
          const sc = statusConfig[s.status];
          return (
            <Card key={s.id} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{s.pensionName}</p>
                  <p className="text-sm text-gray-500">{s.ownerName}</p>
                </div>
                <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded bg-gray-50 p-2">
                  <p className="text-gray-400">패키지</p>
                  <p className="font-medium text-gray-900">{(s.packageRevenue / 10000).toLocaleString()}만</p>
                </div>
                <div className="rounded bg-gray-50 p-2">
                  <p className="text-gray-400">셔틀</p>
                  <p className="font-medium text-gray-900">{(s.shuttleRevenue / 10000).toLocaleString()}만</p>
                </div>
                <div className="rounded bg-gray-50 p-2">
                  <p className="text-gray-400">소개</p>
                  <p className="font-medium text-gray-900">{(s.referralRevenue / 10000).toLocaleString()}만</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">정산액</span>
                <span className="text-lg font-bold text-[#1B6FF4]">{s.net.toLocaleString()}원</span>
              </div>
              {s.status === 'pending' && (
                <Button size="sm" variant="primary" fullWidth className="mt-3" onClick={() => handleConfirm(s.id)}>확정</Button>
              )}
              {s.status === 'confirmed' && (
                <Button size="sm" variant="accent" fullWidth className="mt-3" onClick={() => handlePaid(s.id)}>입금완료</Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
