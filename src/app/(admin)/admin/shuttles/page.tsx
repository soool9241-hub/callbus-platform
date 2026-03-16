'use client';

import { useState } from 'react';
import { Bus, Power, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ShuttleRoute {
  id: string;
  name: string;
  pension: string;
  departure: string;
  destination: string;
  seats: number;
  price: number;
  driver: string;
  status: 'active' | 'inactive';
}

const mockShuttles: ShuttleRoute[] = [
  { id: '1', name: '속초 직행 셔틀', pension: '솔바람 펜션', departure: '서울 강남역', destination: '강원 속초', seats: 25, price: 35000, driver: '김대현', status: 'active' },
  { id: '2', name: '거제 편도 셔틀', pension: '해오름 리조트', departure: '부산 서면', destination: '경남 거제', seats: 20, price: 25000, driver: '박영수', status: 'active' },
  { id: '3', name: '가평 왕복 셔틀', pension: '초록숲 글램핑', departure: '서울 잠실역', destination: '경기 가평', seats: 30, price: 20000, driver: '미배정', status: 'inactive' },
  { id: '4', name: '양양 서핑 셔틀', pension: '바다의정원', departure: '서울 사당역', destination: '강원 양양', seats: 25, price: 30000, driver: '이준호', status: 'active' },
];

export default function ShuttlesPage() {
  const [shuttles, setShuttles] = useState<ShuttleRoute[]>(mockShuttles);

  const toggleStatus = (id: string) => {
    setShuttles((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' as const : 'active' as const } : s
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">셔틀 관리</h1>
        <p className="mt-1 text-sm text-gray-500">펜션 셔틀 노선을 관리합니다.</p>
      </div>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">셔틀명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">펜션</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">노선</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">좌석</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">요금</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">기사</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shuttles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    <Bus className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                shuttles.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{s.pension}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{s.departure} → {s.destination}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{s.seats}석</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{s.price.toLocaleString()}원</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                      {s.driver === '미배정' ? (
                        <span className="text-orange-500">미배정</span>
                      ) : (
                        s.driver
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge variant={s.status === 'active' ? 'success' : 'default'} size="sm" dot>
                        {s.status === 'active' ? '운행중' : '비활성'}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant={s.status === 'active' ? 'secondary' : 'primary'} onClick={() => toggleStatus(s.id)}>
                          <Power className="h-3.5 w-3.5" />
                          {s.status === 'active' ? '비활성화' : '활성화'}
                        </Button>
                        {s.driver === '미배정' && (
                          <Button size="sm" variant="outline">
                            <UserCheck className="h-3.5 w-3.5" />기사배정
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {shuttles.map((s) => (
          <Card key={s.id} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{s.name}</p>
                <p className="text-sm text-gray-500">{s.pension}</p>
              </div>
              <Badge variant={s.status === 'active' ? 'success' : 'default'} size="sm" dot>
                {s.status === 'active' ? '운행중' : '비활성'}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-gray-600">{s.departure} → {s.destination}</p>
            <div className="mt-2 flex gap-4 text-sm text-gray-600">
              <span>{s.seats}석</span>
              <span>{s.price.toLocaleString()}원</span>
              <span>기사: {s.driver}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant={s.status === 'active' ? 'secondary' : 'primary'} onClick={() => toggleStatus(s.id)}>
                {s.status === 'active' ? '비활성화' : '활성화'}
              </Button>
              {s.driver === '미배정' && (
                <Button size="sm" variant="outline">기사배정</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
