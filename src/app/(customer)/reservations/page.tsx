'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  mockReservations,
  mockQuotes,
  mockQuoteRequests,
  mockDrivers,
  mockVehicles,
} from '@/lib/mock-data';
import { VEHICLE_TYPES, RESERVATION_STATUSES } from '@/types';
import type { Reservation } from '@/types';
import {
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Star,
  X,
  FileText,
  ChevronRight,
  Bus,
} from 'lucide-react';

type TabFilter = 'all' | 'pending_payment' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

const tabs: { key: TabFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'pending_payment', label: '결제대기' },
  { key: 'confirmed', label: '확정' },
  { key: 'in_progress', label: '운행중' },
  { key: 'completed', label: '완료' },
  { key: 'cancelled', label: '취소' },
];

const statusVariant: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'default' | 'purple'> = {
  pending_payment: 'warning',
  deposit_paid: 'info',
  confirmed: 'success',
  in_progress: 'purple',
  completed: 'default',
  cancelled: 'danger',
  refunded: 'warning',
};

const driverNames: Record<string, string> = {
  'driver-001': '박정훈',
  'driver-002': '최영호',
};

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

function getStatusLabel(status: string): string {
  return RESERVATION_STATUSES.find((s) => s.key === status)?.label || status;
}

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filtered = mockReservations.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'confirmed') return r.status === 'confirmed' || r.status === 'deposit_paid';
    return r.status === activeTab;
  });

  const handleAction = (action: string, rsv: Reservation) => {
    switch (action) {
      case 'pay':
        alert(`잔금 결제: ${formatPrice(rsv.remaining_amount)}`);
        break;
      case 'cancel':
        alert('예약을 취소하시겠습니까?');
        break;
      case 'review':
        alert('리뷰 작성 페이지로 이동합니다.');
        break;
    }
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 예약</h1>
        <span className="text-sm text-gray-500">{mockReservations.length}건</span>
      </div>

      {/* Tab Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reservation List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>해당하는 예약이 없습니다.</p>
          </div>
        )}

        {filtered.map((rsv) => {
          const quote = mockQuotes.find((q) => q.id === rsv.quote_id);
          const request = quote
            ? mockQuoteRequests.find((r) => r.id === quote.request_id)
            : null;
          const driver = mockDrivers.find((d) => d.id === rsv.driver_id);
          const vehicle = quote
            ? mockVehicles.find((v) => v.id === quote.vehicle_id)
            : null;

          return (
            <Card key={rsv.id} padding="none" hover>
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono text-gray-400">
                    {rsv.reservation_number}
                  </span>
                  <Badge variant={statusVariant[rsv.status] || 'default'} size="sm" dot>
                    {getStatusLabel(rsv.status)}
                  </Badge>
                </div>

                {/* Route */}
                {request && (
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900 text-sm truncate">
                      {request.departure_address.split(' ').slice(0, 3).join(' ')}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium text-gray-900 text-sm truncate">
                      {request.destination_address.split(' ').slice(0, 3).join(' ')}
                    </span>
                  </div>
                )}

                {/* Date */}
                {request && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(request.departure_datetime).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}

                {/* Driver & Vehicle */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {(driverNames[rsv.driver_id] || '기')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {driverNames[rsv.driver_id] || '기사'} 기사님
                      <span className="text-gray-400 font-normal ml-1">
                        {driver?.company_name}
                      </span>
                    </p>
                    {vehicle && (
                      <p className="text-xs text-gray-500 truncate">
                        {vehicle.vehicle_name} | {vehicle.year}년식 | {vehicle.seats}석
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <span>총 금액</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(rsv.total_amount)}
                    </p>
                    <p className="text-xs text-gray-400">
                      예약금 {formatPrice(rsv.deposit_amount)} 결제
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {(rsv.status === 'pending_payment' || rsv.status === 'deposit_paid') && (
                    <>
                      <Button
                        size="sm"
                        fullWidth
                        onClick={() => handleAction('pay', rsv)}
                      >
                        <CreditCard className="w-4 h-4" />
                        잔금결제
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleAction('cancel', rsv)}
                      >
                        <X className="w-4 h-4" />
                        취소
                      </Button>
                    </>
                  )}
                  {rsv.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="danger"
                      fullWidth
                      onClick={() => handleAction('cancel', rsv)}
                    >
                      <X className="w-4 h-4" />
                      취소
                    </Button>
                  )}
                  {rsv.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      onClick={() => handleAction('review', rsv)}
                    >
                      <Star className="w-4 h-4" />
                      리뷰작성
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
