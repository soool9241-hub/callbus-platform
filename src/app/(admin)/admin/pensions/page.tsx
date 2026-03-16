'use client';

import { useState } from 'react';
import { Home, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TabList, Tab } from '@/components/ui/Tabs';

interface Pension {
  id: string;
  ownerName: string;
  pensionName: string;
  region: string;
  rooms: number;
  capacity: number;
  status: 'pending' | 'approved' | 'rejected';
  registeredDate: string;
}

const mockPensions: Pension[] = [
  { id: '1', ownerName: '김민수', pensionName: '솔바람 펜션', region: '강원 속초', rooms: 8, capacity: 32, status: 'approved', registeredDate: '2025-12-10' },
  { id: '2', ownerName: '이영희', pensionName: '해오름 리조트', region: '경남 거제', rooms: 12, capacity: 48, status: 'approved', registeredDate: '2025-11-22' },
  { id: '3', ownerName: '박준혁', pensionName: '산들바람 펜션', region: '충남 태안', rooms: 6, capacity: 24, status: 'pending', registeredDate: '2026-03-01' },
  { id: '4', ownerName: '최서윤', pensionName: '별빛 풀빌라', region: '제주 서귀포', rooms: 10, capacity: 40, status: 'pending', registeredDate: '2026-03-10' },
  { id: '5', ownerName: '정태호', pensionName: '초록숲 글램핑', region: '경기 가평', rooms: 15, capacity: 60, status: 'rejected', registeredDate: '2025-10-15' },
  { id: '6', ownerName: '한소영', pensionName: '바다의정원', region: '강원 양양', rooms: 9, capacity: 36, status: 'approved', registeredDate: '2025-09-05' },
];

const statusConfig: Record<string, { variant: 'warning' | 'success' | 'danger'; label: string }> = {
  pending: { variant: 'warning', label: '승인대기' },
  approved: { variant: 'success', label: '승인' },
  rejected: { variant: 'danger', label: '반려' },
};

export default function PensionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [pensions, setPensions] = useState<Pension[]>(mockPensions);

  const filtered = pensions.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return p.status === 'pending';
    if (activeTab === 'approved') return p.status === 'approved';
    if (activeTab === 'rejected') return p.status === 'rejected';
    return true;
  });

  const handleApprove = (id: string) => {
    setPensions((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p)));
  };

  const handleReject = (id: string) => {
    setPensions((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'rejected' as const } : p)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">펜션 관리</h1>
        <p className="mt-1 text-sm text-gray-500">등록된 펜션을 관리하고 승인/반려 처리합니다.</p>
      </div>

      <TabList activeValue={activeTab} onChange={setActiveTab}>
        <Tab value="all">전체 ({pensions.length})</Tab>
        <Tab value="pending">승인대기 ({pensions.filter((p) => p.status === 'pending').length})</Tab>
        <Tab value="approved">승인 ({pensions.filter((p) => p.status === 'approved').length})</Tab>
        <Tab value="rejected">반려 ({pensions.filter((p) => p.status === 'rejected').length})</Tab>
      </TabList>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">대표자</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">펜션명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">지역</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">객실수</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">수용인원</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">등록일</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    <Home className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const sc = statusConfig[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{p.ownerName}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.pensionName}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.region}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.rooms}개</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.capacity}명</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500">{p.registeredDate}</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        {p.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="primary" onClick={() => handleApprove(p.id)}>
                              <CheckCircle className="h-3.5 w-3.5" />승인
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleReject(p.id)}>
                              <XCircle className="h-3.5 w-3.5" />반려
                            </Button>
                          </div>
                        )}
                      </td>
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
                  <p className="font-medium text-gray-900">{p.pensionName}</p>
                  <p className="text-sm text-gray-500">{p.ownerName} / {p.region}</p>
                </div>
                <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <span>객실 {p.rooms}개</span>
                <span>수용 {p.capacity}명</span>
                <span>{p.registeredDate}</span>
              </div>
              {p.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="primary" onClick={() => handleApprove(p.id)}>승인</Button>
                  <Button size="sm" variant="danger" onClick={() => handleReject(p.id)}>반려</Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
