'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  MapPin,
  Bus,
  Home,
  Users,
  Minus,
  Plus,
  Star,
} from 'lucide-react';

const packageData = {
  id: 'pkg-001',
  name: '속초 해변 힐링 패키지',
  region: '속초',
  duration: '1박 2일',
  description:
    '동해의 맑은 바다와 설악산의 자연을 즐길 수 있는 힐링 패키지입니다. 편안한 펜션 숙박과 안전한 버스 이동을 한번에 해결하세요.',
  gradient: 'from-cyan-400 to-blue-500',
  emoji: '🏖️',
  included: [
    '펜션 1박 숙박 (2인 1실 기준)',
    '왕복 전세버스 (45인승 대형)',
    '여행자 보험',
    '바비큐 시설 이용',
    '조식 제공',
  ],
  notIncluded: ['중식/석식', '개인 경비', '레저 활동비', '음료 및 주류'],
  pension: {
    name: '속초 오션뷰 펜션',
    amenities: ['바다 전망', '바비큐', '주차장', '와이파이', '에어컨', '취사 가능'],
    checkIn: '15:00',
    checkOut: '11:00',
  },
  bus: {
    vehicleType: '45인승 대형 우등버스',
    route: '서울 강남역 → 속초 펜션 (약 2시간 30분)',
  },
  pricing: {
    pensionCost: 55000,
    busCost: 34000,
    totalPerPerson: 89000,
  },
  reviews: [
    { id: 1, author: '김○○', rating: 5, text: '펜션도 깔끔하고 버스도 편안했습니다. 강추!', date: '2025-12-15' },
    { id: 2, author: '이○○', rating: 4, text: '가격 대비 만족스러웠어요. 다만 조식이 좀 아쉬웠습니다.', date: '2025-11-28' },
    { id: 3, author: '박○○', rating: 5, text: '단체 여행으로 이용했는데 너무 좋았어요!', date: '2025-11-10' },
  ],
};

function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}

export default function PackageDetailPage() {
  const router = useRouter();
  const [passengers, setPassengers] = useState(1);
  const pkg = packageData;
  const totalPrice = pkg.pricing.totalPerPerson * passengers;

  return (
    <div className="py-2 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        뒤로가기
      </button>

      {/* Hero */}
      <div className={`h-56 sm:h-72 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center relative mb-6`}>
        <span className="text-7xl">{pkg.emoji}</span>
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="info" size="md">{pkg.region}</Badge>
          <Badge variant="default" size="md">
            <Clock className="w-3 h-3 inline mr-1" />
            {pkg.duration}
          </Badge>
        </div>
      </div>

      {/* Title & Description */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">{pkg.description}</p>

      {/* Included / Not Included */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card padding="md">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">포함 사항</h3>
          <ul className="space-y-2">
            {pkg.included.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card padding="md">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">불포함 사항</h3>
          <ul className="space-y-2">
            {pkg.notIncluded.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Pension Info */}
      <Card padding="md" className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-5 h-5 text-[#1B6FF4]" />
          <h3 className="font-bold text-gray-900">펜션 정보</h3>
        </div>
        <p className="text-sm font-medium text-gray-800 mb-2">{pkg.pension.name}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {pkg.pension.amenities.map((a) => (
            <Badge key={a} variant="default" size="sm">{a}</Badge>
          ))}
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>체크인: <strong>{pkg.pension.checkIn}</strong></span>
          <span>체크아웃: <strong>{pkg.pension.checkOut}</strong></span>
        </div>
      </Card>

      {/* Bus Info */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bus className="w-5 h-5 text-[#1B6FF4]" />
          <h3 className="font-bold text-gray-900">버스 정보</h3>
        </div>
        <p className="text-sm text-gray-700 mb-1">{pkg.bus.vehicleType}</p>
        <p className="text-sm text-gray-500">{pkg.bus.route}</p>
      </Card>

      {/* Price Breakdown */}
      <Card padding="md" className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4">가격 상세</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">펜션 숙박비</span>
            <span className="text-gray-900">{formatPrice(pkg.pricing.pensionCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">버스 이용료</span>
            <span className="text-gray-900">{formatPrice(pkg.pricing.busCost)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100 font-bold">
            <span className="text-gray-900">1인당 합계</span>
            <span className="text-[#FF6B35]">{formatPrice(pkg.pricing.totalPerPerson)}</span>
          </div>
        </div>
      </Card>

      {/* Booking Section */}
      <Card padding="md" className="mb-6 border-[#1B6FF4] border-2">
        <h3 className="font-bold text-gray-900 mb-4">예약하기</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-700 flex items-center gap-1">
            <Users className="w-4 h-4" /> 인원 수
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold w-8 text-center">{passengers}</span>
            <button
              onClick={() => setPassengers(Math.min(45, passengers + 1))}
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
          onClick={() => alert('예약이 접수되었습니다!')}
        >
          예약하기
        </Button>
      </Card>

      {/* Reviews */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          이용 후기
        </h3>
        <div className="space-y-3">
          {pkg.reviews.map((review) => (
            <Card key={review.id} padding="md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{review.author}</span>
                  <StarRating value={review.rating} size="sm" readOnly />
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <p className="text-sm text-gray-700">{review.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
