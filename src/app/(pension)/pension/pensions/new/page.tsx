'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Home,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

const regionOptions = [
  { value: '', label: '지역을 선택하세요' },
  { value: '서울', label: '서울' },
  { value: '경기', label: '경기' },
  { value: '강원', label: '강원' },
  { value: '충청', label: '충청' },
  { value: '전라', label: '전라' },
  { value: '경상', label: '경상' },
  { value: '제주', label: '제주' },
];

const amenitiesList = [
  '바베큐',
  '수영장',
  '노래방',
  '족구장',
  '와이파이',
  '주차장',
  '에어컨',
  '난방',
  '취사가능',
  '세미나실',
];

export default function NewPensionPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [roomCount, setRoomCount] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [checkIn, setCheckIn] = useState('15:00');
  const [checkOut, setCheckOut] = useState('11:00');
  const [amenities, setAmenities] = useState<string[]>([]);

  const handleAmenityToggle = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = () => {
    alert('펜션이 등록되었습니다. (데모)');
    router.push('/pension/pensions');
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">새 펜션 등록</h1>
      </div>

      <div className="max-w-2xl">
        {/* Basic Info */}
        <Card className="mb-6">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
            <div className="space-y-4">
              <Input
                label="펜션 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="펜션 이름을 입력하세요"
              />
              <Input
                label="주소"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="상세 주소를 입력하세요"
              />
              <Select
                label="지역"
                options={regionOptions}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
              <Textarea
                label="펜션 소개"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="펜션에 대한 소개를 입력하세요"
              />
            </div>
          </div>
        </Card>

        {/* Room & Price */}
        <Card className="mb-6">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">객실 및 가격</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="객실 수"
                  type="number"
                  value={roomCount}
                  onChange={(e) => setRoomCount(e.target.value)}
                  placeholder="예: 8"
                />
                <Input
                  label="최대 수용 인원"
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  placeholder="예: 40"
                />
              </div>
              <Input
                label="1박 기준 가격 (원)"
                type="number"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                placeholder="예: 150000"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="체크인 시간"
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
                <Input
                  label="체크아웃 시간"
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Amenities */}
        <Card className="mb-6">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">편의시설</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    amenities.includes(amenity)
                      ? 'border-[#1B6FF4] bg-blue-50 text-[#1B6FF4]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="h-4 w-4 rounded border-gray-300 text-[#1B6FF4] focus:ring-[#1B6FF4]"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Photo Upload */}
        <Card className="mb-6">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">사진 등록</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1B6FF4] transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">클릭하여 사진을 업로드하세요</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG (최대 10MB, 최대 10장)</p>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <Button variant="outline" onClick={() => router.back()} fullWidth>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidth>
            펜션 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
