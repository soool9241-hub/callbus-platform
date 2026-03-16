'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Star,
  DoorOpen,
  CalendarCheck,
  Wallet,
  MessageSquare,
  Home,
  Save,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const amenitiesList = [
  '바베큐', '수영장', '노래방', '족구장', '와이파이',
  '주차장', '에어컨', '난방', '취사가능', '세미나실',
];

const mockPension = {
  id: 'pension-001',
  name: '가평 힐링 펜션',
  region: '경기 가평',
  address: '경기도 가평군 청평면 호반로 123',
  description: '자연 속에서 힐링할 수 있는 프리미엄 펜션입니다. 수도권에서 1시간 거리에 위치하여 접근성이 좋으며, 단체 워크숍 및 가족 여행에 최적화되어 있습니다.',
  rating: 4.7,
  reviewCount: 48,
  roomCount: 8,
  maxCapacity: 40,
  pricePerNight: 150000,
  checkIn: '15:00',
  checkOut: '11:00',
  amenities: ['바베큐', '수영장', '와이파이', '주차장', '에어컨', '난방', '취사가능'],
  status: 'active' as const,
  totalBookings: 156,
  totalRevenue: 23400000,
  totalReviews: 48,
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export default function PensionDetailPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [pension, setPension] = useState(mockPension);
  const [editName, setEditName] = useState(pension.name);
  const [editDescription, setEditDescription] = useState(pension.description);
  const [editAmenities, setEditAmenities] = useState<string[]>(pension.amenities);

  const handleAmenityToggle = (amenity: string) => {
    setEditAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSave = () => {
    setPension((prev) => ({
      ...prev,
      name: editName,
      description: editDescription,
      amenities: editAmenities,
    }));
    setIsEditing(false);
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{pension.name}</h1>
          <Badge
            variant={pension.status === 'active' ? 'success' : 'warning'}
            size="sm"
            dot
          >
            {pension.status === 'active' ? '운영중' : '심사중'}
          </Badge>
        </div>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4" />
            수정
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4" />
              저장
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery Placeholder */}
          <Card padding="none" className="overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <Home className="w-16 h-16 text-blue-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">사진 갤러리 영역</p>
              </div>
            </div>
          </Card>

          {/* Pension Info */}
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">펜션 정보</h2>
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="펜션 이름"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <Textarea
                    label="펜션 소개"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {pension.address}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{pension.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-sm">
                      <span className="text-gray-500">객실 수:</span>{' '}
                      <span className="font-medium text-gray-900">{pension.roomCount}개</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">최대 인원:</span>{' '}
                      <span className="font-medium text-gray-900">{pension.maxCapacity}명</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">체크인:</span>{' '}
                      <span className="font-medium text-gray-900">{pension.checkIn}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">체크아웃:</span>{' '}
                      <span className="font-medium text-gray-900">{pension.checkOut}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">1박 가격:</span>{' '}
                      <span className="font-medium text-gray-900">{formatCurrency(pension.pricePerNight)}원</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Amenities */}
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">편의시설</h2>
              {isEditing ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenitiesList.map((amenity) => (
                    <label
                      key={amenity}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        editAmenities.includes(amenity)
                          ? 'border-[#1B6FF4] bg-blue-50 text-[#1B6FF4]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="h-4 w-4 rounded border-gray-300 text-[#1B6FF4] focus:ring-[#1B6FF4]"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {pension.amenities.map((amenity) => (
                    <Badge key={amenity} variant="info" size="md">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card hover>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <CalendarCheck className="w-5 h-5 text-[#1B6FF4]" />
                <span className="text-sm text-gray-600">총 예약</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pension.totalBookings}
                <span className="text-base font-normal text-gray-500">건</span>
              </p>
            </div>
          </Card>

          <Card hover>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm text-gray-600">총 수입</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(pension.totalRevenue)}
                <span className="text-base font-normal text-gray-500">원</span>
              </p>
            </div>
          </Card>

          <Card hover>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-[#FF6B35]" />
                <span className="text-sm text-gray-600">리뷰</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pension.totalReviews}
                <span className="text-base font-normal text-gray-500">개</span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{pension.rating}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
