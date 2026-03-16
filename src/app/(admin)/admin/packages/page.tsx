'use client';

import { useState } from 'react';
import { Package, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TabList, Tab } from '@/components/ui/Tabs';

interface PackageItem {
  id: string;
  name: string;
  pension: string;
  region: string;
  pricePerPerson: number;
  passengers: number;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  submittedDate: string;
}

const mockPackages: PackageItem[] = [
  { id: '1', name: '속초 힐링 2박3일', pension: '솔바람 펜션', region: '강원 속초', pricePerPerson: 89000, passengers: 20, status: 'active', submittedDate: '2026-02-15' },
  { id: '2', name: '거제도 바다여행 1박2일', pension: '해오름 리조트', region: '경남 거제', pricePerPerson: 75000, passengers: 30, status: 'pending', submittedDate: '2026-03-05' },
  { id: '3', name: '가평 글램핑 체험', pension: '초록숲 글램핑', region: '경기 가평', pricePerPerson: 55000, passengers: 15, status: 'approved', submittedDate: '2026-02-28' },
  { id: '4', name: '제주 풀빌라 프리미엄', pension: '별빛 풀빌라', region: '제주 서귀포', pricePerPerson: 120000, passengers: 10, status: 'pending', submittedDate: '2026-03-12' },
  { id: '5', name: '양양 서핑+숙박 패키지', pension: '바다의정원', region: '강원 양양', pricePerPerson: 95000, passengers: 25, status: 'rejected', submittedDate: '2026-01-20' },
];

const statusConfig: Record<string, { variant: 'warning' | 'success' | 'danger' | 'info'; label: string }> = {
  pending: { variant: 'warning', label: '심사대기' },
  approved: { variant: 'success', label: '승인' },
  rejected: { variant: 'danger', label: '반려' },
  active: { variant: 'info', label: '판매중' },
};

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [packages, setPackages] = useState<PackageItem[]>(mockPackages);

  const filtered = packages.filter((p) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const handleApprove = (id: string) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'approved' as const } : p)));
  };

  const handleReject = (id: string) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'rejected' as const } : p)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">패키지 심사</h1>
        <p className="mt-1 text-sm text-gray-500">펜션 패키지 등록 요청을 심사합니다.</p>
      </div>

      <TabList activeValue={activeTab} onChange={setActiveTab}>
        <Tab value="all">전체 ({packages.length})</Tab>
        <Tab value="pending">심사대기 ({packages.filter((p) => p.status === 'pending').length})</Tab>
        <Tab value="approved">승인 ({packages.filter((p) => p.status === 'approved').length})</Tab>
        <Tab value="rejected">반려 ({packages.filter((p) => p.status === 'rejected').length})</Tab>
        <Tab value="active">판매중 ({packages.filter((p) => p.status === 'active').length})</Tab>
      </TabList>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">패키지명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">펜션</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">지역</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">인당 가격</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">인원</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">제출일</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    <Package className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const sc = statusConfig[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.pension}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.region}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.pricePerPerson.toLocaleString()}원</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{p.passengers}명</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500">{p.submittedDate}</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3.5 w-3.5" />상세보기
                          </Button>
                          {p.status === 'pending' && (
                            <>
                              <Button size="sm" variant="primary" onClick={() => handleApprove(p.id)}>
                                <CheckCircle className="h-3.5 w-3.5" />승인
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleReject(p.id)}>
                                <XCircle className="h-3.5 w-3.5" />반려
                              </Button>
                            </>
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

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => {
          const sc = statusConfig[p.status];
          return (
            <Card key={p.id} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.pension} / {p.region}</p>
                </div>
                <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <span>{p.pricePerPerson.toLocaleString()}원/인</span>
                <span>{p.passengers}명</span>
                <span>{p.submittedDate}</span>
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
