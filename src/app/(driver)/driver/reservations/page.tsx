'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TabList, Tab } from '@/components/ui/Tabs';

type ReservationStatus = '확정' | '진행중' | '완료' | '취소';
type ReservationType = '일반' | '펜션' | '패키지' | '셔틀';

interface Reservation {
  id: string;
  reservationNumber: string;
  customerName: string;
  departure: string;
  destination: string;
  date: string;
  amount: number;
  status: ReservationStatus;
  type: ReservationType;
}

const typeConfig: Record<ReservationType, { emoji: string; variant: 'info' | 'warning' | 'purple' | 'success' }> = {
  '일반': { emoji: '🔵', variant: 'info' },
  '펜션': { emoji: '🟠', variant: 'warning' },
  '패키지': { emoji: '🟣', variant: 'purple' },
  '셔틀': { emoji: '🟢', variant: 'success' },
};

const statusVariant: Record<ReservationStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  '확정': 'info',
  '진행중': 'warning',
  '완료': 'success',
  '취소': 'danger',
};

const mockReservations: Reservation[] = [
  {
    id: 'res-001',
    reservationNumber: 'RES-2026-0301',
    customerName: '김민수',
    departure: '서울 강남구 역삼동',
    destination: '강원도 속초시 해변로',
    date: '2026-03-20',
    amount: 850000,
    status: '확정',
    type: '일반',
  },
  {
    id: 'res-002',
    reservationNumber: 'RES-2026-0302',
    customerName: '이수진',
    departure: '서울 마포구 홍대입구',
    destination: '경기도 가평군 쁘띠프랑스',
    date: '2026-03-18',
    amount: 620000,
    status: '진행중',
    type: '펜션',
  },
  {
    id: 'res-003',
    reservationNumber: 'RES-2026-0303',
    customerName: '박지훈',
    departure: '인천국제공항',
    destination: '서울 중구 명동',
    date: '2026-03-22',
    amount: 450000,
    status: '확정',
    type: '셔틀',
  },
  {
    id: 'res-004',
    reservationNumber: 'RES-2026-0304',
    customerName: '최영희',
    departure: '서울 송파구 잠실',
    destination: '전라남도 여수시 오동도',
    date: '2026-03-10',
    amount: 1200000,
    status: '완료',
    type: '패키지',
  },
  {
    id: 'res-005',
    reservationNumber: 'RES-2026-0305',
    customerName: '정다은',
    departure: '경기도 수원시 팔달구',
    destination: '제주특별자치도 서귀포시',
    date: '2026-03-25',
    amount: 980000,
    status: '확정',
    type: '일반',
  },
];

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState('전체');
  const tabs = ['전체', '확정', '진행중', '완료'];

  const filtered = activeTab === '전체'
    ? mockReservations
    : mockReservations.filter((r) => r.status === activeTab);

  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">내 예약</h1>

      <TabList activeValue={activeTab} onChange={setActiveTab} className="mb-6 w-full">
        {tabs.map((tab) => (
          <Tab key={tab} value={tab}>{tab}</Tab>
        ))}
      </TabList>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">해당 상태의 예약이 없습니다.</p>
          </Card>
        ) : (
          filtered.map((res) => (
            <Link key={res.id} href={`/reservations/${res.id}`}>
              <Card hover className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="info" size="sm">{res.reservationNumber}</Badge>
                      <Badge variant={typeConfig[res.type].variant} size="sm">
                        {typeConfig[res.type].emoji} {res.type}
                      </Badge>
                    </div>
                    <Badge variant={statusVariant[res.status]} size="sm" dot>
                      {res.status}
                    </Badge>
                  </div>

                  <p className="text-sm font-medium text-gray-900 mb-3">
                    고객: {res.customerName}
                  </p>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-[#1B6FF4]" />
                      <div className="w-px h-4 bg-gray-300" />
                      <MapPin className="w-4 h-4 text-[#FF6B35]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{res.departure}</p>
                      <ArrowRight className="w-3 h-3 text-gray-400 my-0.5" />
                      <p className="text-sm text-gray-700 truncate">{res.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{res.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {res.amount.toLocaleString()}원
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
