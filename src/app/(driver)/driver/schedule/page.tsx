'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type TripType = 'bus' | 'package' | 'shuttle';

interface Trip {
  id: string;
  date: number;
  time: string;
  departure: string;
  destination: string;
  type: TripType;
  customerName: string;
}

const typeConfig: Record<TripType, { label: string; color: string; dotColor: string; variant: 'info' | 'purple' | 'success' }> = {
  bus: { label: '일반', color: 'bg-[#1B6FF4]', dotColor: 'bg-[#1B6FF4]', variant: 'info' },
  package: { label: '패키지', color: 'bg-[#FF6B35]', dotColor: 'bg-[#FF6B35]', variant: 'purple' },
  shuttle: { label: '셔틀', color: 'bg-[#10B981]', dotColor: 'bg-[#10B981]', variant: 'success' },
};

const mockTrips: Trip[] = [
  { id: 't1', date: 5, time: '08:00', departure: '서울 강남', destination: '강원 속초', type: 'bus', customerName: '김민수' },
  { id: 't2', date: 8, time: '09:30', departure: '서울 마포', destination: '경기 가평', type: 'package', customerName: '이수진' },
  { id: 't3', date: 12, time: '07:00', departure: '인천공항', destination: '서울 명동', type: 'shuttle', customerName: '박지훈' },
  { id: 't4', date: 15, time: '10:00', departure: '서울 잠실', destination: '전남 여수', type: 'bus', customerName: '최영희' },
  { id: 't5', date: 18, time: '06:30', departure: '경기 수원', destination: '강원 평창', type: 'package', customerName: '정다은' },
  { id: 't6', date: 20, time: '14:00', departure: '서울 종로', destination: '경기 파주', type: 'shuttle', customerName: '한승우' },
  { id: 't7', date: 25, time: '08:30', departure: '서울 송파', destination: '충남 태안', type: 'bus', customerName: '강예린' },
  { id: 't8', date: 28, time: '11:00', departure: '서울 강서', destination: '제주 서귀포', type: 'package', customerName: '윤서준' },
];

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function SchedulePage() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const tripsForDate = selectedDate
    ? mockTrips.filter((t) => t.date === selectedDate)
    : [];

  const tripDates = new Map<number, TripType[]>();
  mockTrips.forEach((t) => {
    if (!tripDates.has(t.date)) tripDates.set(t.date, []);
    tripDates.get(t.date)!.push(t.type);
  });

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">일정 관리</h1>

      {/* Month Navigation */}
      <Card className="mb-6">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={goToPrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {currentYear}년 {currentMonth + 1}월
            </h2>
            <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {DAYS_OF_WEEK.map((day) => (
                  <th key={day} className="py-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(calendarCells.length / 7) }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {calendarCells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                    const types = day ? tripDates.get(day) : undefined;
                    const isSelected = day === selectedDate;
                    const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
                    return (
                      <td key={colIdx} className="p-0.5">
                        {day ? (
                          <button
                            onClick={() => setSelectedDate(day === selectedDate ? null : day)}
                            className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative
                              ${isSelected ? 'bg-[#1B6FF4] text-white' : isToday ? 'bg-blue-50 text-[#1B6FF4] font-bold' : 'hover:bg-gray-50 text-gray-700'}
                            `}
                          >
                            {day}
                            {types && (
                              <div className="flex gap-0.5 mt-0.5">
                                {[...new Set(types)].map((type) => (
                                  <span
                                    key={type}
                                    className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : typeConfig[type].dotColor}`}
                                  />
                                ))}
                              </div>
                            )}
                          </button>
                        ) : (
                          <div className="w-full aspect-square" />
                        )}
                      </td>
                    );
                  })}
                  {/* Pad the last row */}
                  {rowIdx === Math.ceil(calendarCells.length / 7) - 1 &&
                    Array.from({ length: 7 - (calendarCells.length % 7 || 7) }).map((_, i) => (
                      <td key={`pad-${i}`} className="p-0.5">
                        <div className="w-full aspect-square" />
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            {Object.entries(typeConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
                <span className="text-xs text-gray-500">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Selected Date Trips */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentMonth + 1}월 {selectedDate}일 일정
          </h3>
          {tripsForDate.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">이 날짜에 예정된 운행이 없습니다.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {tripsForDate.map((trip) => (
                <Card key={trip.id} hover>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={typeConfig[trip.type].variant} size="sm">
                        {typeConfig[trip.type].label}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{trip.time}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{trip.customerName}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-[#1B6FF4]" />
                      <span>{trip.departure}</span>
                      <span className="text-gray-400">→</span>
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>{trip.destination}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
