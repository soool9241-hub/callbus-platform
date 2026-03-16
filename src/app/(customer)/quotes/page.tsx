'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockQuoteRequests } from '@/lib/mock-data';
import { VEHICLE_TYPES } from '@/types';
import type { QuoteRequest } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { getQuoteRequests } from '@/lib/supabase-db';
import {
  MapPin,
  Calendar,
  Users,
  Bus,
  ChevronRight,
  FileText,
  MessageSquare,
  Loader2,
} from 'lucide-react';

type TabFilter = 'all' | 'open' | 'in_progress' | 'completed' | 'cancelled';

const tabs: { key: TabFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'open', label: '진행중' },
  { key: 'completed', label: '완료' },
  { key: 'cancelled', label: '취소' },
];

const statusConfig: Record<string, { label: string; variant: 'info' | 'success' | 'warning' | 'danger' | 'default' | 'purple' }> = {
  open: { label: '견적접수중', variant: 'info' },
  in_progress: { label: '진행중', variant: 'warning' },
  reserved: { label: '예약완료', variant: 'purple' },
  completed: { label: '완료', variant: 'success' },
  cancelled: { label: '취소', variant: 'danger' },
  expired: { label: '만료', variant: 'default' },
};

function getVehicleLabel(key: string): string {
  return VEHICLE_TYPES.find((v) => v.key === key)?.label || key;
}

export default function QuotesPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    async function fetchData() {
      if (isLoggedIn && currentUser) {
        try {
          const { data, error } = await getQuoteRequests({ customer_id: currentUser.id });
          if (error) throw error;
          setQuoteRequests(data as QuoteRequest[]);
        } catch (err) {
          console.error('견적 요청 목록 로딩 실패:', err);
          setQuoteRequests(mockQuoteRequests);
        }
      } else {
        setQuoteRequests(mockQuoteRequests);
      }
      setLoading(false);
    }

    fetchData();
  }, [isLoggedIn, currentUser, authLoading]);

  const filtered = quoteRequests.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return r.status === 'open' || r.status === 'in_progress';
    return r.status === activeTab;
  });

  const handleClick = (req: QuoteRequest) => {
    if (req.quote_count > 0) {
      window.location.href = `/quotes/${req.id}`;
    } else {
      alert('아직 도착한 견적이 없습니다.');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="py-2 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 견적 요청</h1>
        <span className="text-sm text-gray-600">{quoteRequests.length}건</span>
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

      {/* Request List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>해당하는 견적 요청이 없습니다.</p>
          </div>
        )}

        {filtered.map((req) => {
          const status = statusConfig[req.status] || statusConfig.expired;
          return (
            <Card
              key={req.id}
              hover
              padding="none"
              className="cursor-pointer"
              onClick={() => handleClick(req)}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-mono text-gray-500">{req.request_number}</span>
                  <Badge variant={status.variant} size="sm" dot>
                    {status.label}
                  </Badge>
                </div>

                {/* Route */}
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {req.departure_address.split(' ').slice(0, 3).join(' ')}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {req.destination_address.split(' ').slice(0, 3).join(' ')}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(req.departure_datetime).toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {req.passenger_count}명
                  </span>
                  <span className="flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5" />
                    {req.vehicle_type.map(getVehicleLabel).join(', ')}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    견적 {req.quote_count}건 도착
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
