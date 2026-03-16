'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Bus,
  Users,
  Package,
  ShoppingCart,
  Wallet,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockPackage = {
  id: 'pkg-001',
  name: '가평 힐링 1박2일 패키지',
  description:
    '서울에서 1시간 거리! 자연 속에서 즐기는 힐링 워크숍 패키지입니다. 왕복 버스, 펜션 숙박, 바베큐가 모두 포함되어 있어 편하게 즐기실 수 있습니다.',
  region: '경기 가평',
  pensionName: '가평 힐링 펜션',
  duration: '1박 2일',
  vehicle: '45인승 대형버스',
  tripType: '왕복',
  departureRegion: '서울',
  checkIn: '15:00',
  checkOut: '11:00',
  meal: '바베큐 + 조식 포함',
  pricePerPerson: 89000,
  pensionCost: 1200000,
  busCost: 800000,
  margin: 200000,
  totalCost: 2200000,
  minPassengers: 20,
  maxPassengers: 45,
  includes: ['왕복 버스', '숙박 1박', '바베큐 저녁', '조식', '보험'],
  excludes: ['개인 경비', '추가 식사', '레저 활동비'],
  status: 'active' as const,
  totalOrders: 12,
  totalRevenue: 11760000,
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge variant="success" size="md" dot>판매중</Badge>;
    case 'pending':
      return <Badge variant="warning" size="md" dot>심사중</Badge>;
    case 'draft':
      return <Badge variant="default" size="md">초안</Badge>;
    case 'approved':
      return <Badge variant="info" size="md" dot>승인됨</Badge>;
    default:
      return <Badge variant="default" size="md">{status}</Badge>;
  }
}

export default function PackageDetailPage() {
  const router = useRouter();
  const [pkg] = useState(mockPackage);

  const handleDelete = () => {
    if (confirm('이 패키지를 삭제하시겠습니까?')) {
      alert('패키지가 삭제되었습니다. (데모)');
      router.push('/pension/packages');
    }
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{pkg.name}</h1>
          {getStatusBadge(pkg.status)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/pension/packages/new`)}>
            <Edit className="w-4 h-4" />
            수정
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            삭제
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Info */}
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">패키지 정보</h2>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{pkg.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">지역:</span>
                  <span className="font-medium text-gray-900">{pkg.region}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">기간:</span>
                  <span className="font-medium text-gray-900">{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bus className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">차량:</span>
                  <span className="font-medium text-gray-900">{pkg.vehicle}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">인원:</span>
                  <span className="font-medium text-gray-900">{pkg.minPassengers}~{pkg.maxPassengers}명</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing Breakdown */}
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">가격 구성</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">펜션 비용</span>
                  <span className="text-gray-900">{formatCurrency(pkg.pensionCost)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">버스 비용</span>
                  <span className="text-gray-900">{formatCurrency(pkg.busCost)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">마진</span>
                  <span className="text-gray-900">{formatCurrency(pkg.margin)}원</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold">
                  <span className="text-gray-900">총 비용</span>
                  <span className="text-gray-900">{formatCurrency(pkg.totalCost)}원</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-[#1B6FF4]">1인당 가격</span>
                  <span className="text-[#1B6FF4]">{formatCurrency(pkg.pricePerPerson)}원</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Includes / Excludes */}
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">포함 / 불포함</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-[#10B981] mb-2">포함 사항</h3>
                  <ul className="space-y-1.5">
                    {pkg.includes.map((item) => (
                      <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-500 mb-2">불포함 사항</h3>
                  <ul className="space-y-1.5">
                    {pkg.excludes.map((item) => (
                      <li key={item} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card hover>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-5 h-5 text-[#1B6FF4]" />
                <span className="text-sm text-gray-600">총 주문</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {pkg.totalOrders}
                <span className="text-base font-normal text-gray-500">건</span>
              </p>
            </div>
          </Card>

          <Card hover>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm text-gray-600">총 매출</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(pkg.totalRevenue)}
                <span className="text-base font-normal text-gray-500">원</span>
              </p>
            </div>
          </Card>

          {/* Details */}
          <Card>
            <div className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">추가 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">펜션</span>
                  <span className="text-gray-900">{pkg.pensionName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">출발</span>
                  <span className="text-gray-900">{pkg.departureRegion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">운행</span>
                  <span className="text-gray-900">{pkg.tripType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">체크인</span>
                  <span className="text-gray-900">{pkg.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">체크아웃</span>
                  <span className="text-gray-900">{pkg.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">식사</span>
                  <span className="text-gray-900">{pkg.meal}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
