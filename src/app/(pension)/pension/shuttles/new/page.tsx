'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Navigation,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

const vehicleTypeOptions = [
  { value: '', label: '차량을 선택하세요' },
  { value: '25인승 미니버스', label: '25인승 미니버스' },
  { value: '28인승 중형버스', label: '28인승 중형버스' },
  { value: '45인승 대형버스', label: '45인승 대형버스' },
];

export default function NewShuttlePage() {
  const router = useRouter();
  const [routeName, setRouteName] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination] = useState('경기도 가평군 청평면 호반로 123 (가평 힐링 펜션)');
  const [schedule, setSchedule] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState('');

  const handleSubmit = () => {
    alert('셔틀 노선이 등록되었습니다. (데모)');
    router.push('/pension/shuttles');
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">새 셔틀 노선</h1>
      </div>

      <div className="max-w-2xl">
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">노선 정보</h2>
            <div className="space-y-4">
              <Input
                label="노선 이름"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="예: 서울↔가평 주말 셔틀"
                prefixIcon={<Navigation className="w-4 h-4" />}
              />
              <Input
                label="출발지"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                placeholder="출발지를 입력하세요"
              />
              <Input
                label="목적지"
                value={destination}
                disabled
                helperText="펜션 주소가 자동으로 입력됩니다"
              />
              <Textarea
                label="운행 일정"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="예: 매주 금요일 14:00 출발, 일요일 11:00 복귀"
              />
              <Select
                label="차량 종류"
                options={vehicleTypeOptions}
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="총 좌석 수"
                  type="number"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                  placeholder="예: 45"
                />
                <Input
                  label="좌석당 가격 (원)"
                  type="number"
                  value={pricePerSeat}
                  onChange={(e) => setPricePerSeat(e.target.value)}
                  placeholder="예: 15000"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 mt-6 pb-8">
          <Button variant="outline" onClick={() => router.back()} fullWidth>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidth>
            셔틀 노선 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
