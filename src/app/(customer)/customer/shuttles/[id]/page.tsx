'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Calendar,
  Home,
  Minus,
  Plus,
  Bus,
} from 'lucide-react';

const shuttleData = {
  id: 'shuttle-001',
  routeName: '강남 → 속초 오션뷰 펜션',
  departure: '서울 강남역 2번 출구',
  destination: '속초 오션뷰 펜션',
  region: '속초',
  duration: '약 2시간 30분',
  pricePerSeat: 25000,
  pension: {
    name: '속초 오션뷰 펜션',
    address: '강원도 속초시 해안로 123',
    amenities: ['바다 전망', '바비큐', '주차장', '와이파이'],
    checkIn: '15:00',
    checkOut: '11:00',
  },
};

// Mock calendar data: dates with availability
const dateAvailability = [
  { date: '2026-03-20', day: '금', available: 12, total: 45 },
  { date: '2026-03-21', day: '토', available: 5, total: 45 },
  { date: '2026-03-27', day: '금', available: 20, total: 45 },
  { date: '2026-03-28', day: '토', available: 0, total: 45 },
  { date: '2026-04-03', day: '금', available: 30, total: 45 },
  { date: '2026-04-04', day: '토', available: 18, total: 45 },
  { date: '2026-04-10', day: '금', available: 40, total: 45 },
  { date: '2026-04-11', day: '토', available: 25, total: 45 },
];

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

export default function ShuttleDetailPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [seats, setSeats] = useState(1);
  const [toast, setToast] = useState('');
  const shuttle = shuttleData;

  const selectedAvail = dateAvailability.find((d) => d.date === selectedDate);
  const maxSeats = selectedAvail ? selectedAvail.available : 1;
  const totalPrice = shuttle.pricePerSeat * seats;

  return (
    <div className="py-2 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        뒤로가기
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-2">{shuttle.routeName}</h1>
      <Badge variant="info" size="sm" className="mb-6">{shuttle.region}</Badge>

      {/* Route Map Placeholder */}
      <div className="h-48 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6">
        <div className="text-center text-blue-500">
          <MapPin className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm font-medium">노선 지도</p>
          <p className="text-xs text-blue-400">지도 연동 준비 중</p>
        </div>
      </div>

      {/* Schedule Info */}
      <Card padding="md" className="mb-4">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">운행 정보</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1B6FF4]" />
            <span>출발: {shuttle.departure}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FF6B35]" />
            <span>도착: {shuttle.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>소요 시간: {shuttle.duration}</span>
          </div>
        </div>
      </Card>

      {/* Date Availability Grid */}
      <Card padding="md" className="mb-4">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">날짜별 좌석 현황</h3>
        <div className="grid grid-cols-4 gap-2">
          {dateAvailability.map((d) => {
            const isFull = d.available === 0;
            const isSelected = selectedDate === d.date;
            return (
              <button
                key={d.date}
                disabled={isFull}
                onClick={() => { setSelectedDate(d.date); setSeats(1); }}
                className={`p-3 rounded-lg text-center text-sm transition-colors border ${
                  isSelected
                    ? 'border-[#1B6FF4] bg-blue-50 text-[#1B6FF4]'
                    : isFull
                    ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-300 text-gray-700'
                }`}
              >
                <p className="font-medium">{d.date.slice(5)}</p>
                <p className="text-xs">({d.day})</p>
                <p className={`text-xs mt-1 ${isFull ? 'text-red-400' : d.available <= 5 ? 'text-[#FF6B35]' : 'text-[#10B981]'}`}>
                  {isFull ? '매진' : `${d.available}석`}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Booking Form */}
      <Card padding="md" className="mb-4 border-[#1B6FF4] border-2">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">좌석 예약</h3>

        {!selectedDate ? (
          <p className="text-sm text-gray-400 text-center py-4">날짜를 먼저 선택해주세요.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">선택 날짜</span>
              <span className="text-sm font-medium text-gray-900">{selectedDate} ({selectedAvail?.day})</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <Users className="w-4 h-4" /> 좌석 수
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-bold w-8 text-center">{seats}</span>
                <button
                  onClick={() => setSeats(Math.min(maxSeats, seats + 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">총 결제 금액</span>
              <span className="text-2xl font-bold text-[#FF6B35]">{formatPrice(totalPrice)}</span>
            </div>
            <Button
              variant="accent"
              fullWidth
              size="lg"
              onClick={() => { setToast('좌석 예약이 완료되었습니다!'); setTimeout(() => setToast(''), 2000); }}
            >
              좌석 예약하기
            </Button>
          </>
        )}
      </Card>

      {/* Pension Info */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-5 h-5 text-[#1B6FF4]" />
          <h3 className="font-bold text-gray-900">도착 펜션 정보</h3>
        </div>
        <p className="text-sm font-medium text-gray-800 mb-1">{shuttle.pension.name}</p>
        <p className="text-xs text-gray-500 mb-2">{shuttle.pension.address}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {shuttle.pension.amenities.map((a) => (
            <Badge key={a} variant="default" size="sm">{a}</Badge>
          ))}
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>체크인: <strong>{shuttle.pension.checkIn}</strong></span>
          <span>체크아웃: <strong>{shuttle.pension.checkOut}</strong></span>
        </div>
      </Card>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
