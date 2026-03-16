'use client';

import { useState } from 'react';
import {
  Filter,
  Eye,
  CheckCircle2,
  FileText,
  MapPin,
  Users,
  Bus,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

// ── Mock Data ────────────────────────────────────────────────────────────────

interface SubmittedQuote {
  driver: string;
  company: string;
  price: number;
  rating: number;
  vehicle: string;
}

interface TimelineEvent {
  event: string;
  date: string;
  done: boolean;
}

interface QuoteRequest {
  id: string;
  customer: string;
  customerPhone: string;
  route: string;
  departure: string;
  destination: string;
  vehicleType: string;
  passengers: number;
  quoteCount: number;
  status: string;
  requestDate: string;
  tripDate: string;
  tripType: string;
  purpose: string;
  note: string;
  submittedQuotes: SubmittedQuote[];
  timeline: TimelineEvent[];
}

const mockQuotes: QuoteRequest[] = [
  {
    id: 'Q-2026-0312',
    customer: '김철수',
    customerPhone: '010-1234-5678',
    route: '서울 강남 → 부산 해운대',
    departure: '서울특별시 강남구',
    destination: '부산광역시 해운대구',
    vehicleType: '45인승 대형',
    passengers: 40,
    quoteCount: 3,
    status: '견적접수',
    requestDate: '2026-03-16',
    tripDate: '2026-04-05',
    tripType: '왕복',
    purpose: '회사 워크숍',
    note: '짐이 많을 수 있습니다.',
    submittedQuotes: [
      { driver: '한승우', company: '대한관광', price: 850000, rating: 4.8, vehicle: '45인승 현대 유니버스' },
      { driver: '윤서현', company: '코리아버스', price: 920000, rating: 4.9, vehicle: '45인승 기아 그랜버드' },
      { driver: '김대호', company: '한국투어', price: 780000, rating: 4.3, vehicle: '45인승 현대 유니버스' },
    ],
    timeline: [
      { event: '견적 요청 접수', date: '2026-03-16 14:30', done: true },
      { event: '기사 견적 제출 (3건)', date: '2026-03-16 16:00', done: true },
      { event: '고객 검토 중', date: '', done: false },
      { event: '예약 확정', date: '', done: false },
    ],
  },
  {
    id: 'Q-2026-0311',
    customer: '이영희',
    customerPhone: '010-2345-6789',
    route: '인천공항 → 강릉',
    departure: '인천광역시 중구',
    destination: '강원도 강릉시',
    vehicleType: '28인승 중형',
    passengers: 25,
    quoteCount: 2,
    status: '대기',
    requestDate: '2026-03-16',
    tripDate: '2026-03-28',
    tripType: '편도',
    purpose: '동창회 여행',
    note: '',
    submittedQuotes: [
      { driver: '한승우', company: '대한관광', price: 620000, rating: 4.8, vehicle: '28인승 현대 카운티' },
      { driver: '오지훈', company: '서울고속', price: 580000, rating: 4.5, vehicle: '28인승 현대 카운티' },
    ],
    timeline: [
      { event: '견적 요청 접수', date: '2026-03-16 13:15', done: true },
      { event: '기사 견적 제출 (2건)', date: '2026-03-16 15:30', done: true },
      { event: '고객 검토 중', date: '', done: false },
      { event: '예약 확정', date: '', done: false },
    ],
  },
  {
    id: 'Q-2026-0310',
    customer: '박민수',
    customerPhone: '010-3456-7890',
    route: '서울 → 전주',
    departure: '서울특별시 종로구',
    destination: '전라북도 전주시',
    vehicleType: '45인승 대형',
    passengers: 38,
    quoteCount: 4,
    status: '예약확정',
    requestDate: '2026-03-15',
    tripDate: '2026-04-12',
    tripType: '왕복',
    purpose: '가족 모임',
    note: '노인분들이 많습니다.',
    submittedQuotes: [
      { driver: '윤서현', company: '코리아버스', price: 720000, rating: 4.9, vehicle: '45인승 기아 그랜버드' },
    ],
    timeline: [
      { event: '견적 요청 접수', date: '2026-03-15 11:42', done: true },
      { event: '기사 견적 제출 (4건)', date: '2026-03-15 14:00', done: true },
      { event: '고객 견적 선택', date: '2026-03-15 18:30', done: true },
      { event: '예약 확정', date: '2026-03-16 09:00', done: true },
    ],
  },
  {
    id: 'Q-2026-0309',
    customer: '최지은',
    customerPhone: '010-4567-8901',
    route: '수원 → 경주',
    departure: '경기도 수원시',
    destination: '경상북도 경주시',
    vehicleType: '28인승 중형',
    passengers: 20,
    quoteCount: 0,
    status: '만료',
    requestDate: '2026-03-10',
    tripDate: '2026-03-18',
    tripType: '왕복',
    purpose: '학교 수학여행',
    note: '',
    submittedQuotes: [],
    timeline: [
      { event: '견적 요청 접수', date: '2026-03-10 10:05', done: true },
      { event: '견적 마감 (0건)', date: '2026-03-13 10:05', done: true },
      { event: '요청 만료', date: '2026-03-13 10:05', done: true },
    ],
  },
  {
    id: 'Q-2026-0308',
    customer: '정우성',
    customerPhone: '010-5678-9012',
    route: '서울 → 속초',
    departure: '서울특별시 마포구',
    destination: '강원도 속초시',
    vehicleType: '25인승 소형',
    passengers: 18,
    quoteCount: 1,
    status: '대기',
    requestDate: '2026-03-16',
    tripDate: '2026-04-01',
    tripType: '편도',
    purpose: '동호회 MT',
    note: '새벽 출발 희망',
    submittedQuotes: [
      { driver: '오지훈', company: '서울고속', price: 450000, rating: 4.5, vehicle: '25인승 현대 카운티' },
    ],
    timeline: [
      { event: '견적 요청 접수', date: '2026-03-16 09:20', done: true },
      { event: '기사 견적 제출 (1건)', date: '2026-03-16 11:00', done: true },
      { event: '고객 검토 중', date: '', done: false },
      { event: '예약 확정', date: '', done: false },
    ],
  },
];

const statusConfig: Record<string, { variant: 'info' | 'warning' | 'success' | 'default' | 'danger'; label: string }> = {
  '대기': { variant: 'warning', label: '대기' },
  '견적접수': { variant: 'info', label: '견적접수' },
  '예약확정': { variant: 'success', label: '예약확정' },
  '만료': { variant: 'default', label: '만료' },
  '취소': { variant: 'danger', label: '취소' },
};

const statusOptions = [
  { value: '', label: '전체 상태' },
  { value: '대기', label: '대기' },
  { value: '견적접수', label: '견적접수' },
  { value: '예약확정', label: '예약확정' },
  { value: '만료', label: '만료' },
];

const regionOptions = [
  { value: '', label: '전체 지역' },
  { value: '서울', label: '서울' },
  { value: '인천', label: '인천' },
  { value: '경기', label: '경기' },
  { value: '강원', label: '강원' },
  { value: '부산', label: '부산' },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function QuotesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  const filteredQuotes = mockQuotes.filter((q) => {
    if (statusFilter && q.status !== statusFilter) return false;
    if (regionFilter && !q.route.includes(regionFilter)) return false;
    return true;
  });

  const openDetail = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setDetailOpen(true);
  };

  const formatCurrency = (amount: number) =>
    '\u20A9' + amount.toLocaleString('ko-KR');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">견적 관리</h1>
        <p className="mt-1 text-sm text-gray-500">모든 견적 요청과 진행 상태를 관리합니다.</p>
      </div>

      {/* Filter Bar */}
      <Card padding="md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter className="h-4 w-4" />
            필터
          </div>
          <div className="w-full sm:w-40">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="상태 선택"
            />
          </div>
          <div className="w-full sm:w-40">
            <Select
              options={regionOptions}
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              placeholder="지역 선택"
            />
          </div>
          <div className="w-full sm:w-48">
            <Input type="date" />
          </div>
          <span className="text-sm text-gray-400">~</span>
          <div className="w-full sm:w-48">
            <Input type="date" />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">요청번호</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">고객명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">노선</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">차량타입</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">인원</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">견적수</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">요청일</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredQuotes.map((q) => (
                <tr
                  key={q.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => openDetail(q)}
                >
                  <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{q.id}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.customer}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.route}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.vehicleType}</td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.passengers}명</td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-700">{q.quoteCount}건</td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <Badge
                      variant={statusConfig[q.status]?.variant || 'default'}
                      size="sm"
                      dot
                    >
                      {statusConfig[q.status]?.label || q.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-gray-500">{q.requestDate}</td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetail(q);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      상세
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                    <FileText className="mx-auto mb-2 h-8 w-8" />
                    해당 조건의 견적이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={`견적 상세 - ${selectedQuote?.id || ''}`}
        size="lg"
      >
        {selectedQuote && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Request Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">요청 정보</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-gray-400" />
                  {selectedQuote.customer} ({selectedQuote.customerPhone})
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {selectedQuote.route}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bus className="h-4 w-4 text-gray-400" />
                  {selectedQuote.vehicleType} / {selectedQuote.passengers}명 / {selectedQuote.tripType}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  운행일: {selectedQuote.tripDate}
                </div>
              </div>
              {selectedQuote.purpose && (
                <p className="mt-2 text-sm text-gray-500">목적: {selectedQuote.purpose}</p>
              )}
              {selectedQuote.note && (
                <p className="mt-1 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
                  참고: {selectedQuote.note}
                </p>
              )}
            </div>

            {/* Submitted Quotes */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">
                제출된 견적 ({selectedQuote.submittedQuotes.length}건)
              </h3>
              {selectedQuote.submittedQuotes.length === 0 ? (
                <p className="text-sm text-gray-400">아직 제출된 견적이 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {selectedQuote.submittedQuotes.map((sq, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {sq.driver} <span className="text-gray-400">({sq.company})</span>
                        </p>
                        <p className="text-xs text-gray-500">{sq.vehicle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(sq.price)}</p>
                        <p className="text-xs text-gray-400">평점 {sq.rating}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">진행 상태</h3>
              <div className="relative space-y-4 pl-6">
                <div className="absolute bottom-0 left-2.5 top-0 w-px bg-gray-200" />
                {selectedQuote.timeline.map((t, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                        t.done
                          ? 'bg-blue-600 text-white'
                          : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {t.done && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <div>
                      <p className={`text-sm ${t.done ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                        {t.event}
                      </p>
                      {t.date && <p className="text-xs text-gray-400">{t.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
