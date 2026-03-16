'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Info,
  Send,
  User,
  Phone,
  MapPin,
  Calendar,
  Users,
  Bus,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const vehicleTypeOptions = [
  { value: '', label: '차량을 선택하세요' },
  { value: '25인승 미니버스', label: '25인승 미니버스' },
  { value: '28인승 중형버스', label: '28인승 중형버스' },
  { value: '45인승 대형버스', label: '45인승 대형버스' },
];

export default function QuoteRequestPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress] = useState('경기도 가평군 청평면 호반로 123 (가평 힐링 펜션)');
  const [departureDate, setDepartureDate] = useState('');
  const [passengerCount, setPassengerCount] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const handleSubmit = () => {
    alert('대리 견적 요청이 전송되었습니다. (데모)');
    router.push('/pension/dashboard');
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">대리 견적 요청</h1>
      </div>

      <div className="max-w-2xl">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <Info className="w-5 h-5 text-[#1B6FF4] shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            투숙객 대신 버스 견적을 요청합니다. 견적이 도착하면 고객에게 공유할 수 있습니다.
          </p>
        </div>

        {/* Form */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">고객 정보</h2>
            <div className="space-y-4">
              <Input
                label="고객 이름"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="고객 이름을 입력하세요"
                prefixIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="연락처"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="010-0000-0000"
                prefixIcon={<Phone className="w-4 h-4" />}
              />
            </div>
          </div>
        </Card>

        <Card className="mt-6">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">운행 정보</h2>
            <div className="space-y-4">
              <Input
                label="출발지"
                value={departureAddress}
                onChange={(e) => setDepartureAddress(e.target.value)}
                placeholder="출발지 주소를 입력하세요"
                prefixIcon={<MapPin className="w-4 h-4" />}
              />
              <Input
                label="목적지"
                value={destinationAddress}
                disabled
                prefixIcon={<MapPin className="w-4 h-4" />}
                helperText="펜션 주소가 자동으로 입력됩니다"
              />
              <Input
                label="출발 일시"
                type="datetime-local"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                prefixIcon={<Calendar className="w-4 h-4" />}
              />
              <Input
                label="탑승 인원"
                type="number"
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
                placeholder="인원 수를 입력하세요"
                prefixIcon={<Users className="w-4 h-4" />}
              />
              <Select
                label="차량 종류"
                options={vehicleTypeOptions}
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="mt-6 pb-8">
          <Button variant="primary" fullWidth size="lg" onClick={handleSubmit}>
            <Send className="w-4 h-4" />
            대리 견적 요청하기
          </Button>
        </div>
      </div>
    </div>
  );
}
