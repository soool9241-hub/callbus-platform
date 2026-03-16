'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StarRating } from '@/components/ui/StarRating';
import { Search, MapPin, Bus, Clock, Users } from 'lucide-react';

const mockPackages = [
  {
    id: 'pkg-001',
    name: '속초 해변 힐링 패키지',
    region: '속초',
    pensionName: '속초 오션뷰 펜션',
    busInfo: { vehicle: '45인승 대형버스', tripType: '왕복' },
    duration: '1박 2일',
    pricePerPerson: 89000,
    rating: 4.7,
    reviewCount: 128,
    emoji: '🏖️',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'pkg-002',
    name: '가평 자연 속 휴식 패키지',
    region: '가평',
    pensionName: '가평 숲속 글램핑',
    busInfo: { vehicle: '28인승 중형버스', tripType: '왕복' },
    duration: '1박 2일',
    pricePerPerson: 75000,
    rating: 4.5,
    reviewCount: 96,
    emoji: '🌲',
    gradient: 'from-green-400 to-emerald-600',
  },
  {
    id: 'pkg-003',
    name: '태안 해안 드라이브 패키지',
    region: '태안',
    pensionName: '태안 꽃지해변 펜션',
    busInfo: { vehicle: '45인승 우등버스', tripType: '왕복' },
    duration: '2박 3일',
    pricePerPerson: 135000,
    rating: 4.3,
    reviewCount: 64,
    emoji: '🌊',
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'pkg-004',
    name: '경주 역사 탐방 패키지',
    region: '경주',
    pensionName: '경주 한옥 스테이',
    busInfo: { vehicle: '45인승 대형버스', tripType: '왕복' },
    duration: '2박 3일',
    pricePerPerson: 145000,
    rating: 4.8,
    reviewCount: 210,
    emoji: '🏛️',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'pkg-005',
    name: '제주 올레길 패키지',
    region: '제주',
    pensionName: '제주 돌담 펜션',
    busInfo: { vehicle: '28인승 리무진', tripType: '편도 (항공 별도)' },
    duration: '2박 3일',
    pricePerPerson: 195000,
    rating: 4.9,
    reviewCount: 315,
    emoji: '🍊',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 'pkg-006',
    name: '여수 밤바다 패키지',
    region: '여수',
    pensionName: '여수 엑스포 펜션',
    busInfo: { vehicle: '45인승 우등버스', tripType: '왕복' },
    duration: '1박 2일',
    pricePerPerson: 99000,
    rating: 4.6,
    reviewCount: 178,
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

const priceOptions = [
  { value: '', label: '가격대' },
  { value: '0-100000', label: '10만원 이하' },
  { value: '100000-150000', label: '10~15만원' },
  { value: '150000-999999', label: '15만원 이상' },
];

const durationOptions = [
  { value: '', label: '기간' },
  { value: '1박 2일', label: '1박 2일' },
  { value: '2박 3일', label: '2박 3일' },
];

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

export default function PackagesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const filtered = mockPackages.filter((pkg) => {
    if (search && !pkg.name.includes(search) && !pkg.region.includes(search)) return false;
    if (region && pkg.region !== region) return false;
    if (duration && pkg.duration !== duration) return false;
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (pkg.pricePerPerson < min || pkg.pricePerPerson > max) return false;
    }
    return true;
  });

  return (
    <div className="py-2 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">펜션+버스 패키지</h1>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="패키지명, 지역으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefixIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <Select
          options={regionOptions}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <Select
          options={priceOptions}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Select
          options={durationOptions}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((pkg) => (
          <Card key={pkg.id} hover padding="none" className="overflow-hidden cursor-pointer" onClick={() => router.push(`/customer/packages/${pkg.id}`)}>
            {/* Photo placeholder */}
            <div className={`h-40 bg-gradient-to-br ${pkg.gradient} flex items-center justify-center relative`}>
              <span className="text-5xl">{pkg.emoji}</span>
              <Badge variant="info" size="sm" className="absolute top-3 left-3">
                {pkg.region}
              </Badge>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1 truncate">{pkg.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{pkg.pensionName}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Bus className="w-3.5 h-3.5" />
                  {pkg.busInfo.vehicle}
                </span>
                <span className="text-gray-300">|</span>
                <span>{pkg.busInfo.tripType}</span>
              </div>

              <div className="flex items-center gap-1 mb-3">
                <StarRating value={pkg.rating} size="sm" readOnly />
                <span className="text-xs text-gray-500 ml-1">{pkg.rating} ({pkg.reviewCount})</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {pkg.duration}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#FF6B35]">{formatPrice(pkg.pricePerPerson)}</span>
                  <span className="text-xs text-gray-500 block">1인 기준</span>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="sm"
                className="mt-3"
                onClick={(e) => { e.stopPropagation(); router.push(`/customer/packages/${pkg.id}`); }}
              >
                상세보기
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>검색 조건에 맞는 패키지가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
