'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Filter,
  Bell,
  Bus,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockQuoteRequests, mockUsers } from '@/lib/mock-data';
import { VEHICLE_TYPES } from '@/types';

const regionOptions = [
  { value: '', label: '전체 지역' },
  { value: '서울', label: '서울' },
  { value: '경기', label: '경기' },
  { value: '강원', label: '강원' },
  { value: '충청', label: '충청' },
  { value: '전라', label: '전라' },
  { value: '경상', label: '경상' },
  { value: '제주', label: '제주' },
];

const vehicleTypeOptions = [
  { value: '', label: '전체 차량' },
  ...VEHICLE_TYPES.map((v) => ({ value: v.key, label: v.label })),
];

function getTimeAgo(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일 전`;
}

function getRegionFromAddress(address: string): string {
  if (address.includes('서울')) return '서울';
  if (address.includes('경기') || address.includes('인천')) return '경기';
  if (address.includes('강원')) return '강원';
  if (address.includes('충청') || address.includes('대전') || address.includes('세종') || address.includes('충남') || address.includes('충북')) return '충청';
  if (address.includes('전라') || address.includes('광주') || address.includes('전남') || address.includes('전북')) return '전라';
  if (address.includes('경상') || address.includes('부산') || address.includes('대구') || address.includes('울산') || address.includes('경남') || address.includes('경북')) return '경상';
  if (address.includes('제주')) return '제주';
  return '';
}

function getVehicleTypeLabel(typeKeys: string[]): string {
  return typeKeys
    .map((key) => {
      const found = VEHICLE_TYPES.find((v) => v.key === key);
      return found ? found.label : key;
    })
    .join(', ');
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function DriverDashboardPage() {
  const [regionFilter, setRegionFilter] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Only show open requests
  const openRequests = mockQuoteRequests.filter(
    (r) => r.status === 'open' || r.status === 'in_progress'
  );

  const filteredRequests = useMemo(() => {
    return openRequests.filter((req) => {
      // Region filter
      if (regionFilter) {
        const depRegion = getRegionFromAddress(req.departure_address);
        const destRegion = getRegionFromAddress(req.destination_address);
        if (depRegion !== regionFilter && destRegion !== regionFilter) return false;
      }

      // Vehicle type filter
      if (vehicleTypeFilter) {
        if (!req.vehicle_type.includes(vehicleTypeFilter)) return false;
      }

      // Date filter
      if (dateFilter) {
        const reqDate = req.departure_datetime.split('T')[0];
        if (reqDate !== dateFilter) return false;
      }

      return true;
    });
  }, [openRequests, regionFilter, vehicleTypeFilter, dateFilter]);

  const notificationCount = openRequests.length;

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">새 견적 요청</h1>
          {notificationCount > 0 && (
            <span className="inline-flex items-center justify-center px-2.5 py-1 text-sm font-bold text-white bg-green-600 rounded-full">
              {notificationCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">실시간 업데이트</span>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4">
          <div className="flex items-center gap-2 text-gray-500 shrink-0">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">필터</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
            <Select
              options={regionOptions}
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              placeholder="전체 지역"
            />
            <Select
              options={vehicleTypeOptions}
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              placeholder="전체 차량"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          {(regionFilter || vehicleTypeFilter || dateFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRegionFilter('');
                setVehicleTypeFilter('');
                setDateFilter('');
              }}
            >
              초기화
            </Button>
          )}
        </div>
      </Card>

      {/* Request Feed */}
      {filteredRequests.length === 0 ? (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                조건에 맞는 견적 요청이 없습니다
              </h3>
              <p className="text-sm text-gray-500">
                필터를 변경하거나 잠시 후 다시 확인해 주세요.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const customer = mockUsers.find((u) => u.id === req.customer_id);
            return (
              <Card key={req.id} hover className="overflow-hidden">
                <div className="p-5">
                  {/* Top Row: Request number + time ago */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="info" size="sm">
                        {req.request_number}
                      </Badge>
                      <Badge
                        variant={req.status === 'open' ? 'success' : 'warning'}
                        size="sm"
                        dot
                      >
                        {req.status === 'open' ? '접수중' : '진행중'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{getTimeAgo(req.created_at)}</span>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div className="w-px h-6 bg-gray-300" />
                      <MapPin className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {req.departure_address}
                      </p>
                      <div className="flex items-center my-1">
                        <ArrowRight className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-400">
                          {req.trip_type === 'round' ? '왕복' : '편도'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {req.destination_address}
                      </p>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {formatDate(req.departure_datetime)} {formatTime(req.departure_datetime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{req.passenger_count}명</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-gray-400" />
                      <span>{getVehicleTypeLabel(req.vehicle_type)}</span>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="mb-3">
                    <Badge variant="purple" size="sm">
                      {req.purpose}
                    </Badge>
                  </div>

                  {/* Special Requests Preview */}
                  {req.special_requests && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 bg-gray-50 rounded-lg p-3">
                      {req.special_requests}
                    </p>
                  )}

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      견적 {req.quote_count}건 제출됨
                    </div>
                    <Link href={`/quote-submit?requestId=${req.id}`}>
                      <Button
                        className="bg-green-600 hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500"
                        size="sm"
                      >
                        견적 제출하기
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
