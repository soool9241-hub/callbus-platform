'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import {
  Bus,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Shield,
  CreditCard,
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  Truck,
  Home,
} from 'lucide-react';

/* ─── Data ─── */

const vehicleTypes = [
  { name: '11인승 밴', emoji: '🚐', seats: '11인승', price: '15만~' },
  { name: '15인승 미니버스', emoji: '🚐', seats: '15인승', price: '20만~' },
  { name: '25인승 버스', emoji: '🚌', seats: '25인승', price: '35만~' },
  { name: '45인승 대형', emoji: '🚍', seats: '45인승', price: '55만~' },
  { name: '우등 리무진', emoji: '✨', seats: '우등', price: '70만~' },
  { name: '프리미엄', emoji: '👑', seats: '프리미엄', price: '90만~' },
];

const packages = [
  {
    region: '강원',
    name: '속초 해변펜션',
    bus: '45인승 왕복',
    duration: '1박2일',
    price: '89,000',
  },
  {
    region: '경기',
    name: '가평 숲속펜션',
    bus: '25인승 왕복',
    duration: '1박2일',
    price: '69,000',
  },
  {
    region: '충남',
    name: '태안 바다펜션',
    bus: '45인승 왕복',
    duration: '2박3일',
    price: '129,000',
  },
];

const steps = [
  {
    num: '01',
    title: '간편 견적 신청',
    desc: '출발지, 도착지, 날짜, 인원만. 30초면 끝',
    Icon: Calendar,
  },
  {
    num: '02',
    title: '견적 비교',
    desc: '전국 기사님의 견적을 가격·평점·차량 한눈에 비교',
    Icon: Users,
  },
  {
    num: '03',
    title: '예약 & 결제',
    desc: '카카오페이, 네이버페이, 토스 간편 결제',
    Icon: CreditCard,
  },
  {
    num: '04',
    title: '안심 탑승',
    desc: '전담매니저, GPS 실시간 추적, 노쇼 보상',
    Icon: Shield,
  },
];

const trustItems = [
  { emoji: '🛡️', title: '10단계 기사 검증', desc: '실명·보험·면허 검증 완료' },
  { emoji: '👨‍💼', title: '전담 매니저', desc: '50만원 이상 건 1:1 케어' },
  { emoji: '💰', title: '계약금 보호', desc: '에스크로 안전 결제' },
  { emoji: '🔄', title: '대체 배차 보장', desc: '기사 노쇼 시 즉시 대체' },
  { emoji: '🚫', title: '추가금 없음', desc: '견적 외 추가 요구 금지' },
  { emoji: '📋', title: '보험 3개월 재검증', desc: '자동 보험 유효성 확인' },
];

const sampleReviews = [
  {
    id: '1',
    name: '김*수',
    purpose: '결혼식 하객버스',
    rating: 5,
    text: '하객 50명이 타고 갔는데 기사님도 친절하시고, 차량도 깨끗했어요. 다음에 또 이용할게요!',
    date: '2026.02.15',
  },
  {
    id: '2',
    name: '이*연',
    purpose: '워크샵 단체이동',
    rating: 5,
    text: '회사 워크샵으로 강원도까지 편하게 갔다왔습니다. 견적 비교가 되니 가격 협상할 필요가 없어서 좋았어요.',
    date: '2026.01.28',
  },
  {
    id: '3',
    name: '박*호',
    purpose: '동창회 여행',
    rating: 4,
    text: '가격도 저렴하고 예약 과정이 정말 간편했습니다. 기사님이 시간 약속도 잘 지켜주셔서 만족합니다.',
    date: '2026.03.05',
  },
];

const navLinks = [
  { label: '견적신청', href: '#hero' },
  { label: '패키지', href: '#packages' },
  { label: '이용방법', href: '#how-it-works' },
  { label: '후기', href: '#reviews' },
  { label: '안심보장', href: '#trust' },
];

/* ─── Component ─── */

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'bus' | 'package'>('bus');

  // Quote form state
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (departure) params.set('departure', departure);
    if (destination) params.set('destination', destination);
    if (date) params.set('date', date);
    if (passengers) params.set('passengers', passengers);
    if (vehicleType) params.set('vehicleType', vehicleType);
    if (activeTab === 'package') params.set('type', 'package');
    router.push(`/quote-request?${params.toString()}`);
  }

  return (
    <div className="flex flex-col min-h-screen font-[Pretendard]">
      {/* ── Section 1: Fixed Navigation Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-[#1B6FF4]">🚌 버스고</span>
              <span className="text-[10px] font-bold bg-[#FF6B35] text-white px-1.5 py-0.5 rounded-full leading-none">
                +펜션
              </span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#1B6FF4] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/auth"
                className="inline-flex items-center px-4 py-2 bg-[#1B6FF4] text-white text-sm font-semibold rounded-lg hover:bg-[#0B4FCC] transition-colors"
              >
                기사님 가입
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-base font-medium text-gray-700 hover:text-[#1B6FF4]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/auth"
                className="block w-full text-center px-4 py-2.5 bg-[#1B6FF4] text-white font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                기사님 가입
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Section 2: Hero + Quote Form ── */}
      <section
        id="hero"
        className="relative pt-16 bg-gradient-to-br from-[#1B6FF4] to-[#0B4FCC] text-white overflow-hidden"
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left side */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                버스대절 최저가 비교부터
                <br />
                펜션 패키지까지
                <br />
                한번에
              </h1>
              <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-lg mx-auto lg:mx-0">
                전국 기사님 견적 비교 · 24시간 무료취소 · 안심 예약 보장
              </p>

              {/* 4 stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: '25%', label: '저렴' },
                  { value: '4.9', label: '평점' },
                  { value: '3분', label: '견적' },
                  { value: '24h', label: '무료취소' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center"
                  >
                    <p className="text-2xl font-extrabold">{s.value}</p>
                    <p className="text-sm text-blue-100">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Quote Form */}
            <div className="w-full lg:w-[440px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Tab switcher */}
                <div className="flex">
                  <button
                    className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                      activeTab === 'bus'
                        ? 'bg-[#1B6FF4] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('bus')}
                  >
                    🚌 버스대절
                  </button>
                  <button
                    className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
                      activeTab === 'package'
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveTab('package')}
                  >
                    🏕️ 펜션+버스
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleQuoteSubmit} className="p-5 space-y-3.5">
                  {/* Departure */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="출발지"
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                    />
                  </div>

                  {/* Destination */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={activeTab === 'package' ? '펜션 지역' : '도착지'}
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                    />
                  </div>

                  {/* Date */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                    />
                  </div>

                  {/* Passengers */}
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      placeholder="인원 수"
                      min={1}
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                    />
                  </div>

                  {/* Vehicle type */}
                  <div className="relative">
                    <Bus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4] appearance-none bg-white"
                    >
                      <option value="">차량 종류 선택</option>
                      {vehicleTypes.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.emoji} {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    className={`w-full py-3.5 text-base font-bold rounded-lg transition-colors ${
                      activeTab === 'bus'
                        ? 'bg-[#1B6FF4] hover:bg-[#0B4FCC] text-white'
                        : 'bg-[#FF6B35] hover:bg-[#e55a28] text-white'
                    }`}
                  >
                    {activeTab === 'bus' ? '🚌 무료 견적 받기' : '🏕️ 패키지 견적 받기'}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    수수료없이 무료 · 3분내 견적도착
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Stats Bar ── */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '70만건+', label: '누적 견적' },
              { value: '6,000명+', label: '등록 기사' },
              { value: '300개', label: '전국 버스회사' },
              { value: '24시간', label: '무료취소' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`${i > 0 ? 'md:border-l md:border-gray-200' : ''}`}
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-[#1B6FF4]">{s.value}</p>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Vehicle Types ── */}
      <section className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              차량 종류
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              다양한 차량 중 딱 맞는 버스를 선택하세요
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {vehicleTypes.map((vt) => (
              <div
                key={vt.name}
                className="bg-white rounded-xl border border-gray-200 p-5 text-center cursor-pointer transition-all duration-200 hover:border-[#1B6FF4] hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-4xl mb-3">{vt.emoji}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{vt.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{vt.seats}</p>
                <p className="text-sm font-bold text-[#1B6FF4] mt-2">{vt.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Pension+Bus Package ── */}
      <section id="packages" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              🆕 펜션 + 버스 패키지
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              숙박과 단체 이동을 한번에!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image placeholder */}
                <div className="h-44 bg-gradient-to-br from-[#E8F1FE] to-[#FFF0EB] flex items-center justify-center">
                  <span className="text-5xl">🏕️</span>
                </div>
                <div className="p-5">
                  <span className="inline-block px-2.5 py-1 bg-[#E8F1FE] text-[#1B6FF4] text-xs font-bold rounded-full mb-3">
                    {pkg.region}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5" /> {pkg.bus}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {pkg.duration}
                    </p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-[#FF6B35]">
                        {pkg.price}원
                      </span>
                      <span className="text-sm text-gray-500">/1인</span>
                    </div>
                    <Link
                      href="/packages"
                      className="text-sm font-semibold text-[#1B6FF4] hover:underline flex items-center gap-0.5"
                    >
                      상세보기 <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF6B35] hover:bg-[#e55a28] text-white font-bold rounded-xl transition-colors"
            >
              🏕️ 전체 패키지 보기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 6: How It Works ── */}
      <section id="how-it-works" className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              이용 방법
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              간단한 4단계로 전세버스를 예약하세요
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1B6FF4] text-white rounded-2xl mb-4 shadow-lg shadow-blue-200">
                  <step.Icon className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-[#1B6FF4] mb-1">STEP {step.num}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: Trust Badges ── */}
      <section id="trust" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              안심 보장
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              버스고만의 6가지 안심 장치
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-[#F8FAFC] rounded-xl p-6 border border-gray-100"
              >
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 8: Reviews ── */}
      <section id="reviews" className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              실제 이용 후기
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map((review) => (
              <Card key={review.id} padding="md" className="flex flex-col gap-3">
                {/* Profile row */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F1FE] flex items-center justify-center text-[#1B6FF4] text-sm font-bold">
                    {review.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{review.name}</span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> 운행인증
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{review.purpose}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>

                {/* Date */}
                <p className="text-xs text-gray-400 mt-auto">{review.date}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9: Partner CTAs ── */}
      {/* Pension Owner CTA */}
      <section className="bg-gradient-to-r from-[#1B6FF4] to-[#0B4FCC] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            펜션 사업주님, 내 펜션에 버스 서비스를 연결하세요
          </h2>
          <p className="text-blue-100 mb-8 text-base sm:text-lg">
            투숙객 대리 견적 · 패키지 판매 · 정기 셔틀
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1B6FF4] font-bold rounded-xl hover:bg-blue-50 transition-colors"
            >
              🏕️ 펜션 사업주 가입
            </Link>
            <Link
              href="/packages"
              className="inline-flex items-center gap-1 text-white/90 hover:text-white font-medium underline underline-offset-4 transition-colors"
            >
              자세히 알아보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Driver Partner CTA */}
      <section className="bg-gray-100 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            기사님, 더 많은 운행 기회를 잡으세요
          </h2>
          <p className="text-gray-600 mb-6 text-base sm:text-lg">
            전국 견적 실시간 확인 · 투명한 수수료 · 빠른 정산
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8 text-sm font-semibold text-gray-700">
            <span>8~12% 수수료만</span>
            <span className="text-gray-300">|</span>
            <span>주 1회 정산</span>
            <span className="text-gray-300">|</span>
            <span>무료 가입</span>
          </div>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1B6FF4] hover:bg-[#0B4FCC] text-white font-bold rounded-xl transition-colors"
          >
            🚌 기사 파트너 가입
          </Link>
        </div>
      </section>

      {/* ── Section 10: Footer ── */}
      <footer className="bg-[#0F172A] text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Logo + Company */}
            <div>
              <span className="text-xl font-extrabold text-white">🚌 버스고</span>
              <p className="mt-4 text-sm leading-relaxed">
                전국 버스 대절 가격 비교 플랫폼
                <br />
                펜션+버스 패키지 서비스
              </p>
            </div>

            {/* Column 1 */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">서비스</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/quote-request" className="hover:text-white transition-colors">
                    버스 대절
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:text-white transition-colors">
                    펜션+버스 패키지
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500">정기 셔틀</span>
                </li>
                <li>
                  <span className="text-gray-500">통근 버스</span>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">파트너</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/auth" className="hover:text-white transition-colors">
                    기사 가입
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-white transition-colors">
                    펜션 사업주 가입
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500">제휴 문의</span>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">고객지원</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <span className="text-gray-500">FAQ</span>
                </li>
                <li>
                  <span className="text-gray-500">이용약관</span>
                </li>
                <li>
                  <span className="text-gray-500">개인정보처리방침</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            &copy; 2026 버스고. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
