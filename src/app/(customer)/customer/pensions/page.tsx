'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StarRating } from '@/components/ui/StarRating';
import { MapPin, Search } from 'lucide-react';

const mockPensions = [
  {
    id: 'pen-001',
    name: '속초 오션뷰 펜션',
    region: '속초',
    rating: 4.7,
    reviewCount: 128,
    pricePerNight: 120000,
    amenities: ['바다 전망', '바비큐', '주차장', '와이파이'],
    emoji: '🏖️',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'pen-002',
    name: '가평 숲속 글램핑',
    region: '가평',
    rating: 4.5,
    reviewCount: 96,
    pricePerNight: 95000,
    amenities: ['글램핑', '계곡', '주차장', '취사 가능'],
    emoji: '🌲',
    gradient: 'from-green-400 to-emerald-600',
  },
  {
    id: 'pen-003',
    name: '태안 꽃지해변 펜션',
    region: '태안',
    rating: 4.3,
    reviewCount: 64,
    pricePerNight: 85000,
    amenities: ['해변 근처', '주차장', '와이파이', '에어컨'],
    emoji: '🌊',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'pen-004',
    name: '경주 한옥 스테이',
    region: '경주',
    rating: 4.8,
    reviewCount: 210,
    pricePerNight: 150000,
    amenities: ['한옥', '정원', '조식', '와이파이'],
    emoji: '🏛️',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'pen-005',
    name: '제주 돌담 펜션',
    region: '제주',
    rating: 4.9,
    reviewCount: 315,
    pricePerNight: 180000,
    amenities: ['감귤밭', '개별 바비큐', '수영장', '와이파이'],
    emoji: '🍊',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 'pen-006',
    name: '여수 엑스포 펜션',
    region: '여수',
    rating: 4.6,
    reviewCount: 178,
    pricePerNight: 110000,
    amenities: ['야경', '주차장', '와이파이', '에어컨'],
    emoji: '🌙',
    gradient: 'from-purple-400 to-indigo-600',
  },
];

const regionOptions = [
  { value: '', label: '전체 지역' },
  { value: '속초', label: '속초' },
  { value: '가평', label: '가평' },
  { value: '태안', label: '태안' },
  { value: '경주', label: '경주' },
  { value: '제주', label: '제주' },
  { value: '여수', label: '여수' },
];

const allAmenities = ['바다 전망', '바비큐', '주차장', '와이파이', '수영장', '글램핑', '한옥', '조식', '계곡', '취사 가능'];

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

export default function PensionsPage() {
  const router = useRouter();
  const [region, setRegion] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filtered = mockPensions.filter((p) => {
    if (region && p.region !== region) return false;
    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every((a) => p.amenities.includes(a));
      if (!hasAll) return false;
    }
    return true;
  });

  return (
    <div className="py-2 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">펜션 둘러보기</h1>

      {/* Region Filter */}
      <div className="mb-4">
        <Select
          options={regionOptions}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
      </div>

      {/* Amenity Filter */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">편의시설</label>
        <div className="flex flex-wrap gap-2">
          {allAmenities.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${
                  isSelected
                    ? 'bg-[#1B6FF4] text-white border-[#1B6FF4]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => toggleAmenity(amenity)}
                />
                {amenity}
              </label>
            );
          })}
        </div>
      </div>

      {/* Pension Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((pension) => (
          <Card
            key={pension.id}
            hover
            padding="none"
            className="overflow-hidden cursor-pointer"
            onClick={() => alert(`${pension.name} 상세 페이지는 준비 중입니다.`)}
          >
            {/* Photo placeholder */}
            <div className={`h-40 bg-gradient-to-br ${pension.gradient} flex items-center justify-center relative`}>
              <span className="text-5xl">{pension.emoji}</span>
              <Badge variant="info" size="sm" className="absolute top-3 left-3">
                {pension.region}
              </Badge>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{pension.name}</h3>

              <div className="flex items-center gap-1 mb-2">
                <StarRating value={pension.rating} size="sm" readOnly />
                <span className="text-xs text-gray-500 ml-1">{pension.rating} ({pension.reviewCount})</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {pension.amenities.slice(0, 4).map((a) => (
                  <Badge key={a} variant="default" size="sm">{a}</Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-[#FF6B35]">{formatPrice(pension.pricePerNight)}</span>
                  <span className="text-xs text-gray-500 ml-1">/ 1박</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); alert(`${pension.name} 상세 페이지는 준비 중입니다.`); }}
                >
                  상세보기
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>검색 조건에 맞는 펜션이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
