'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockReviews } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';
import { getReviews } from '@/lib/supabase-db';
import type { Review } from '@/types';
import {
  Bus,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Plane,
  Mountain,
  Heart,
  Briefcase,
  Car,
  TreePine,
  Building,
  GraduationCap,
} from 'lucide-react';

const vehicleTypes = [
  { name: '15인승 미니밴', emoji: '🚐', desc: '소규모 모임' },
  { name: '25인승', emoji: '🚌', desc: '중형 단체' },
  { name: '45인승 대형', emoji: '🚍', desc: '대형 단체' },
  { name: '리무진', emoji: '✨', desc: '프리미엄' },
  { name: '우등', emoji: '💺', desc: '편안한 좌석' },
  { name: '쏠라티', emoji: '🚙', desc: '소형 프리미엄' },
  { name: '스프린터', emoji: '🚐', desc: '소형 VIP' },
];

const purposes = [
  { name: '결혼식', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { name: '엠티', icon: Mountain, color: 'bg-green-100 text-green-600' },
  { name: '단체여행', icon: MapPin, color: 'bg-blue-100 text-blue-600' },
  { name: '골프', icon: TreePine, color: 'bg-emerald-100 text-emerald-600' },
  { name: '산악회', icon: Mountain, color: 'bg-orange-100 text-orange-600' },
  { name: '공항', icon: Plane, color: 'bg-sky-100 text-sky-600' },
  { name: '워크샵', icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { name: '통근', icon: Building, color: 'bg-gray-100 text-gray-600' },
];

const steps = [
  {
    num: '01',
    title: '견적 신청',
    desc: '출발지, 도착지, 일정, 인원만 입력하면 끝!',
    icon: Calendar,
  },
  {
    num: '02',
    title: '비교 선택',
    desc: '여러 기사님의 견적을 한눈에 비교하세요.',
    icon: Users,
  },
  {
    num: '03',
    title: '편하게 출발',
    desc: '예약 확정 후 안전하게 이동하세요.',
    icon: Bus,
  },
];

const reviewerNames: Record<string, string> = {
  'user-001': '김민수',
  'user-002': '이서연',
};

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const [sampleReviews, setSampleReviews] = useState<Review[]>(mockReviews.slice(0, 3));

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await getReviews();
        if (!error && data && data.length > 0) {
          setSampleReviews(data.slice(0, 3) as Review[]);
        }
      } catch {
        // Fall back to mock data (already set as default)
      }
    }

    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-5 py-2 bg-white/20 rounded-full text-sm sm:text-base font-medium mb-8 backdrop-blur-sm">
              전국 300개 버스회사와 함께합니다
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-8">
              전세버스 대절,
              <br />
              한번에 비교하세요!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-12 max-w-xl mx-auto leading-relaxed">
              견적 한 번이면 여러 버스회사의 가격을 비교하고
              <br className="hidden sm:block" />
              가장 합리적인 선택을 할 수 있어요.
            </p>
            <Link href="/quote-request">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 px-10 py-5 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all min-h-[56px]">
                무료 견적 신청하기
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">70만건+</p>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">누적 견적</p>
            </div>
            <div className="border-l border-gray-200">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">6,000명+</p>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">등록 기사</p>
            </div>
            <div className="border-l border-gray-200">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">300개</p>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">전국 버스회사</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">이용 방법</h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">간단한 3단계로 전세버스를 예약하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-200">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-blue-600 mb-1">STEP {step.num}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">차량 종류</h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">다양한 차량 중 딱 맞는 버스를 선택하세요</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vehicleTypes.map((vt) => (
              <Card key={vt.name} hover padding="md" className="text-center cursor-pointer group">
                <div className="text-4xl mb-3">{vt.emoji}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{vt.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{vt.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose Showcase */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">이용 목적</h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">어떤 목적이든 콜버스와 함께하세요</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {purposes.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.color}`}>
                  <p.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">이용 후기</h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">실제 이용고객의 생생한 후기를 확인하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map((review) => (
              <Card key={review.id} padding="md" className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">{review.rating}.0</span>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-3">{review.content}</p>
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                    {((review as any).profiles?.name || reviewerNames[review.customer_id] || '고객')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {(review as any).profiles?.name || reviewerNames[review.customer_id] || '고객'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            지금 바로 견적을 받아보세요
          </h2>
          <p className="text-blue-100 mb-10 text-base sm:text-lg leading-relaxed">
            1분이면 견적 신청 완료! 여러 기사님의 견적을 무료로 비교할 수 있습니다.
          </p>
          <Link href="/quote-request">
            <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 px-10 py-5 text-lg font-bold rounded-xl shadow-lg min-h-[56px]">
              무료 견적 신청하기
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
