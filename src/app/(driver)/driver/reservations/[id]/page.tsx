'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  MessageSquare,
  Camera,
  Clock,
  CheckCircle2,
  Circle,
  Truck,
  XCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const mockReservation = {
  id: 'res-001',
  reservationNumber: 'RES-2026-0301',
  status: '확정' as const,
  customer: {
    name: '김민수',
    phone: '010-****-5678',
    specialRequests: '어르신이 계셔서 계단 없는 곳으로 정차 부탁드립니다. 출발 10분 전 연락 부탁드립니다.',
  },
  route: {
    departure: '서울 강남구 역삼동 테헤란로 123',
    waypoints: ['경기도 용인시 수지구 (휴게소 정차)', '충청북도 충주시 (점심 식사)'],
    destination: '강원도 속초시 해변로 45',
  },
  vehicle: {
    name: '현대 유니버스 럭셔리',
    plateNumber: '서울 72바 1234',
  },
  price: {
    total: 850000,
    platformFee: 85000,
    netAmount: 765000,
  },
  date: '2026-03-20',
  time: '08:00',
};

const statusSteps = ['접수', '확정', '운행중', '완료'];

function getStepStatus(step: string, currentStatus: string) {
  const stepIndex = statusSteps.indexOf(step);
  const currentIndex = statusSteps.indexOf(currentStatus);
  if (stepIndex < currentIndex) return 'done';
  if (stepIndex === currentIndex) return 'current';
  return 'pending';
}

export default function ReservationDetailPage() {
  const params = useParams();
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const res = mockReservation;

  return (
    <div className="px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/reservations" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">예약 상세</h1>
          <p className="text-sm text-gray-500">{res.reservationNumber}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <Card className="mb-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">진행 상태</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => {
              const status = getStepStatus(step, res.status);
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    {status === 'done' ? (
                      <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                    ) : status === 'current' ? (
                      <div className="w-8 h-8 rounded-full bg-[#1B6FF4] flex items-center justify-center">
                        <Circle className="w-4 h-4 text-white fill-white" />
                      </div>
                    ) : (
                      <Circle className="w-8 h-8 text-gray-300" />
                    )}
                    <span className={`text-xs mt-1 font-medium ${
                      status === 'current' ? 'text-[#1B6FF4]' : status === 'done' ? 'text-[#10B981]' : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      status === 'done' ? 'bg-[#10B981]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Customer Info */}
      <Card className="mb-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#1B6FF4]" />
            고객 정보
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">이름</span>
              <span className="text-sm font-medium text-gray-900">{res.customer.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">연락처</span>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {res.customer.phone}
              </span>
            </div>
            {res.customer.specialRequests && (
              <div className="pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500 block mb-1">특별 요청사항</span>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                  {res.customer.specialRequests}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Route Info */}
      <Card className="mb-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#1B6FF4]" />
            경로 정보
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1B6FF4] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">출</div>
              <p className="text-sm text-gray-900">{res.route.departure}</p>
            </div>
            {res.route.waypoints.map((wp, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-gray-600">{wp}</p>
              </div>
            ))}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">도</div>
              <p className="text-sm text-gray-900">{res.route.destination}</p>
            </div>
          </div>
          {/* Map Placeholder */}
          <div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            카카오맵 연동 예정
          </div>
        </div>
      </Card>

      {/* Vehicle Assignment + Photo Upload */}
      <Card className="mb-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#1B6FF4]" />
            배차 정보
          </h2>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">차량</span>
              <span className="text-sm font-medium text-gray-900">{res.vehicle.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">차량번호</span>
              <span className="text-sm font-medium text-gray-900">{res.vehicle.plateNumber}</span>
            </div>
          </div>
          {/* Vehicle Authentication Photo */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">차량 인증 사진</p>
            <p className="text-xs text-gray-500 mb-3">무단대차 방지를 위해 운행 전 차량 사진을 촬영해주세요</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPhotoUploaded(true)}
            >
              {photoUploaded ? '✅ 업로드 완료' : '사진 촬영/업로드'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Price Info */}
      <Card className="mb-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">정산 정보</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">총 금액</span>
              <span className="text-sm font-medium text-gray-900">{res.price.total.toLocaleString()}원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">플랫폼 수수료 (10%)</span>
              <span className="text-sm font-medium text-red-500">-{res.price.platformFee.toLocaleString()}원</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-base font-semibold text-gray-900">실수령액</span>
              <span className="text-xl font-bold text-[#1B6FF4]">{res.price.netAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          className="flex-1 bg-[#1B6FF4] hover:bg-[#0B4FCC] active:bg-[#0940A8]"
          size="lg"
        >
          <Clock className="w-5 h-5" />
          운행 시작
        </Button>
        <Link href="/chat/res-001" className="flex-1">
          <Button variant="outline" size="lg" fullWidth>
            <MessageSquare className="w-5 h-5" />
            고객 채팅
          </Button>
        </Link>
        <Button variant="danger" size="lg" className="flex-1">
          <XCircle className="w-5 h-5" />
          취소 요청
        </Button>
      </div>
    </div>
  );
}
