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
  ChevronDown,
  Shield,
  CreditCard,
  Menu,
  X,
  Phone,
  Clock,
  Download,
  MessageCircle,
  UserCheck,
  RefreshCw,
  FileCheck,
  Banknote,
  Headphones,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const vehicleTypes = [
  { name: '10인승 밴', emoji: '🚐', seats: '10인승', price: '12만~', amenities: ['USB'] },
  { name: '14인승 밴', emoji: '🚐', seats: '14인승', price: '15만~', amenities: ['USB'] },
  { name: '16인승 미니우등', emoji: '🚐', seats: '16인승', price: '20만~', amenities: ['USB', 'TV'] },
  { name: '19인승 미니우등', emoji: '🚐', seats: '19인승', price: '25만~', amenities: ['USB', 'TV'] },
  { name: '24인승 미니버스', emoji: '🚌', seats: '24인승', price: '30만~', amenities: ['USB', 'TV'] },
  { name: '24인승 미니썬롱', emoji: '🚌', seats: '24인승', price: '33만~', amenities: ['USB', 'TV', 'WiFi'] },
  { name: '21인승 중형우등', emoji: '🚌', seats: '21인승', price: '38만~', amenities: ['USB', 'WiFi', 'TV'] },
  { name: '33인승 중형', emoji: '🚌', seats: '33인승', price: '42만~', amenities: ['USB', 'TV'] },
  { name: '41인승 대형', emoji: '🚍', seats: '41인승', price: '50만~', amenities: ['USB', 'TV', 'WiFi'] },
  { name: '45인승 대형', emoji: '🚍', seats: '45인승', price: '55만~', amenities: ['USB', 'TV', 'WiFi'] },
  { name: '28인승 대형우등', emoji: '✨', seats: '28인승', price: '70만~', amenities: ['USB', 'WiFi', 'TV', '냉장고'] },
  { name: '21인승 대형프리미엄', emoji: '👑', seats: '21인승', price: '90만~', amenities: ['USB', 'WiFi', 'TV', '냉장고'] },
];

const useCases = [
  { emoji: '💒', title: '결혼식 버스', desc: '하객 단체 이동을 한번에 해결', tag: '결혼식' },
  { emoji: '🏢', title: '워크샵/MT', desc: '회사 워크샵, 대학 MT 전세버스', tag: '워크샵' },
  { emoji: '🎵', title: '콘서트/페스티벌', desc: '공연장까지 단체 이동', tag: '콘서트' },
  { emoji: '⛰️', title: '산악회', desc: '등산 모임 정기 버스 대절', tag: '산악회' },
  { emoji: '🎓', title: '동창회/동호회', desc: '모임 여행, 체육대회 이동', tag: '동창회' },
  { emoji: '🏭', title: '통근셔틀', desc: '기업·공장 통근 정기 셔틀', tag: '통근' },
  { emoji: '✈️', title: '관광/여행', desc: '국내 관광, 단체 여행 버스', tag: '관광' },
  { emoji: '🎒', title: '학교/어린이집', desc: '소풍, 현장학습, 수학여행', tag: '학교' },
];

const packages = [
  { region: '강원', name: '속초 해변펜션', bus: '45인승 왕복', duration: '1박2일', price: '89,000' },
  { region: '경기', name: '가평 숲속펜션', bus: '25인승 왕복', duration: '1박2일', price: '69,000' },
  { region: '충남', name: '태안 바다펜션', bus: '45인승 왕복', duration: '2박3일', price: '129,000' },
];

const steps = [
  { num: '01', title: '간편 견적 신청', desc: '출발지, 도착지, 날짜, 인원만 입력하면 30초면 끝', Icon: Calendar },
  { num: '02', title: '견적 비교', desc: '전국 기사님의 견적을 가격·평점·차량으로 한눈에 비교', Icon: Users },
  { num: '03', title: '예약 & 결제', desc: '카카오페이, 네이버페이, 토스 간편 결제 지원', Icon: CreditCard },
  { num: '04', title: '안심 탑승', desc: '전담매니저 배정, GPS 실시간 추적, 노쇼 보상까지', Icon: Shield },
];

const premiumCareItems = [
  { emoji: '👨‍💼', icon: Headphones, title: '전담매니저 배정', desc: '50만원 이상 건에 1:1 전담매니저가 배정되어 출발부터 도착까지 케어합니다' },
  { emoji: '💰', icon: Shield, title: '계약금 100% 보호', desc: '에스크로 안전 결제로 계약금을 100% 보호합니다. 운행 완료 후 기사님께 정산됩니다' },
  { emoji: '🔍', icon: UserCheck, title: '기사 10단계 검증', desc: '실명·운전면허·보험·범죄이력 등 10단계 검증을 통과한 기사님만 등록됩니다' },
  { emoji: '📋', icon: FileCheck, title: '3개월 보험 재검증', desc: '3개월 단위로 보험증서를 재검증하여 항상 유효한 보험 상태를 유지합니다' },
  { emoji: '🔄', icon: RefreshCw, title: '노쇼 시 대체배차', desc: '기사님 노쇼 발생 시 즉시 대체 배차를 보장합니다. 걱정 없이 예약하세요' },
  { emoji: '🚫', icon: Banknote, title: '추가금 0원 보장', desc: '견적 외 추가 비용 요구를 금지합니다. 톨비·주차비·식사비 모두 포함 견적입니다' },
];

const sampleReviews = [
  { id: '1', name: '김*수', purpose: '결혼식 하객버스', rating: 5, text: '하객 50명이 타고 갔는데 기사님도 친절하시고, 차량도 깨끗했어요. 다음에 또 이용할게요!', date: '2026.02.15' },
  { id: '2', name: '이*연', purpose: '워크샵 단체이동', rating: 5, text: '회사 워크샵으로 강원도까지 편하게 갔다왔습니다. 견적 비교가 되니 가격 협상할 필요가 없어서 좋았어요.', date: '2026.01.28' },
  { id: '3', name: '박*호', purpose: '동창회 여행', rating: 4, text: '가격도 저렴하고 예약 과정이 정말 간편했습니다. 기사님이 시간 약속도 잘 지켜주셔서 만족합니다.', date: '2026.03.05' },
  { id: '4', name: '최*진', purpose: '콘서트 단체이동', rating: 5, text: '콘서트 갈 때 친구들이랑 45인승 빌렸는데 1인당 가격이 너무 저렴했어요. 돌아올 때도 편하게!', date: '2026.02.20' },
  { id: '5', name: '정*미', purpose: '학교 현장학습', rating: 5, text: '아이들 현장학습 버스로 이용했는데 안전하고 깨끗한 차량이라 안심이 됐습니다. 기사님도 매우 친절하셨어요.', date: '2026.03.01' },
  { id: '6', name: '한*석', purpose: '산악회 정기모임', rating: 5, text: '매달 이용하는 산악회인데 가격비교로 매번 최저가에 좋은 기사님 배정받고 있습니다. 강추!', date: '2026.03.10' },
];

const faqData = [
  { q: '견적은 어떻게 받나요?', a: '출발지, 도착지, 날짜, 인원, 차량 종류를 입력하면 3분 이내에 최대 20개 견적을 받을 수 있습니다. 견적 신청은 무료이며, 비교 후 원하는 견적을 선택하시면 됩니다.' },
  { q: '취소/환불 정책은 어떻게 되나요?', a: '운행 24시간 전까지 무료 취소가 가능합니다. 24시간 이내 취소 시 취소 수수료가 발생할 수 있으며, 자세한 내용은 예약 시 안내드립니다.' },
  { q: '부대비용(톨비, 주차비)은 별도인가요?', a: '아닙니다. 버스고의 견적에는 톨비, 주차비, 기사 식사비가 모두 포함되어 있습니다. 견적 외 추가 비용은 발생하지 않습니다.' },
  { q: '기사님 정보를 미리 확인할 수 있나요?', a: '네, 예약 확정 후 기사님의 실명, 사진, 소속 버스회사, 운행 경력, 이용자 후기를 확인하실 수 있습니다. 10단계 검증을 통과한 기사님만 배정됩니다.' },
  { q: '결제 방법은 어떤 것이 있나요?', a: '카카오페이, 네이버페이, 토스페이 등 간편결제와 계좌이체, 신용카드 결제가 가능합니다. 에스크로 방식으로 안전하게 결제됩니다.' },
  { q: '펜션+버스 패키지는 어떤 건가요?', a: '숙박(펜션)과 단체 이동(전세버스)을 한번에 예약할 수 있는 패키지 상품입니다. 별도로 예약하는 것보다 최대 30% 저렴하게 이용 가능합니다.' },
];

const navLinks = [
  { label: '견적신청', href: '#hero' },
  { label: '차량안내', href: '#vehicles' },
  { label: '이용방법', href: '#how-it-works' },
  { label: '이용사례', href: '#use-cases' },
  { label: '후기', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
];

const purposeOptions = [
  '결혼식', '워크샵/MT', '콘서트/페스티벌', '산악회', '동창회/동호회', '통근셔틀', '관광/여행', '학교/어린이집', '기타',
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'bus' | 'package'>('bus');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quote form state
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [purpose, setPurpose] = useState('');

  function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (departure) params.set('departure', departure);
    if (destination) params.set('destination', destination);
    if (departureDate) params.set('date', departureDate);
    if (returnDate) params.set('returnDate', returnDate);
    if (passengers) params.set('passengers', passengers);
    if (vehicleType) params.set('vehicleType', vehicleType);
    if (purpose) params.set('purpose', purpose);
    if (activeTab === 'package') params.set('type', 'package');
    router.push(`/customer/quote-request?${params.toString()}`);
  }

  function scrollTo(href: string) {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex flex-col min-h-screen font-[Pretendard]">
      {/* ================================================================ */}
      {/*  1. Fixed Navbar                                                  */}
      {/* ================================================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-[#1B6FF4]">🚌 버스고</span>
              <span className="text-[10px] font-bold bg-[#FF6B35] text-white px-1.5 py-0.5 rounded-full leading-none">
                1등 버스대절
              </span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium text-gray-700 hover:text-[#1B6FF4] transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/auth?role=customer"
                className="inline-flex items-center px-4 py-2 border-2 border-[#1B6FF4] text-[#1B6FF4] text-sm font-semibold rounded-lg hover:bg-[#1B6FF4] hover:text-white transition-colors"
              >
                일반 회원가입
              </Link>
              <Link
                href="/auth?role=driver"
                className="inline-flex items-center px-4 py-2 bg-[#FF6B35] text-white text-sm font-semibold rounded-lg hover:bg-[#E55A2B] transition-colors"
              >
                🚌 기사님 전용
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
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left text-base font-medium text-gray-700 hover:text-[#1B6FF4]"
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/auth?role=customer"
                className="block w-full text-center px-4 py-2.5 border-2 border-[#1B6FF4] text-[#1B6FF4] font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                일반 회원가입
              </Link>
              <Link
                href="/auth?role=driver"
                className="block w-full text-center px-4 py-2.5 bg-[#FF6B35] text-white font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                🚌 기사님 전용
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ================================================================ */}
      {/*  2 & 3. Hero + Quote Form                                        */}
      {/* ================================================================ */}
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
              <div className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                🏆 전국 1등 버스대절 가격비교
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-tight mb-6">
                전국 1등 버스대절
                <br />
                <span className="text-yellow-300">최저가</span> 비교
              </h1>
              <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-lg mx-auto lg:mx-0">
                한번의 견적으로 최대 20개 비교 · 타사대비 25% 저렴
              </p>

              {/* 3 stat badges */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                {[
                  { value: '25%', label: '타사대비 저렴', color: 'bg-yellow-400/20' },
                  { value: '3분', label: '최대 20개 견적', color: 'bg-green-400/20' },
                  { value: '4.9점', label: '기사님 평균 평점', color: 'bg-purple-400/20' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`${s.color} backdrop-blur-sm rounded-xl px-4 py-4 text-center`}
                  >
                    <p className="text-2xl sm:text-3xl font-extrabold">{s.value}</p>
                    <p className="text-xs sm:text-sm text-blue-100 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Quote Form */}
            <div className="w-full lg:w-[460px] flex-shrink-0">
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
                <form onSubmit={handleQuoteSubmit} className="p-5 space-y-3">
                  {/* Departure */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="출발지 (예: 서울 강남역)"
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                    />
                  </div>

                  {/* Destination */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B35]" />
                    <input
                      type="text"
                      placeholder={activeTab === 'package' ? '펜션 지역 (예: 강원 속초)' : '도착지 (예: 강원 속초)'}
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                    />
                  </div>

                  {/* Dates row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        title="출발일"
                        className="w-full pl-10 pr-2 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        title="귀환일 (왕복시)"
                        placeholder="귀환일"
                        className="w-full pl-10 pr-2 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                      />
                    </div>
                  </div>

                  {/* Passengers + Vehicle row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="인원 수"
                        min={1}
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className="w-full pl-10 pr-2 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4]"
                      />
                    </div>
                    <div className="relative">
                      <Bus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full pl-10 pr-2 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4] appearance-none bg-white"
                      >
                        <option value="">차량 종류</option>
                        {vehicleTypes.map((v) => (
                          <option key={v.name} value={v.name}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/30 focus:border-[#1B6FF4] appearance-none bg-white"
                    >
                      <option value="">이용 목적 선택</option>
                      {purposeOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    className={`w-full py-4 text-base font-bold rounded-lg transition-all shadow-lg ${
                      activeTab === 'bus'
                        ? 'bg-[#1B6FF4] hover:bg-[#0B4FCC] text-white shadow-blue-200'
                        : 'bg-[#FF6B35] hover:bg-[#e55a28] text-white shadow-orange-200'
                    }`}
                  >
                    {activeTab === 'bus' ? '🚌 무료 견적 받기' : '🏕️ 패키지 견적 받기'}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    수수료 없이 완전 무료 · 3분 내 최대 20개 견적 도착
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  4. Phone Consultation Bar                                       */}
      {/* ================================================================ */}
      <section className="bg-[#0B4FCC] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
            <span className="text-sm sm:text-base font-medium">빠른 상담이 필요하세요?</span>
            <a
              href="tel:1588-5252"
              className="inline-flex items-center gap-2 text-lg sm:text-xl font-extrabold hover:text-yellow-300 transition-colors"
            >
              <Phone className="w-5 h-5" />
              1588-5252
            </a>
            <span className="text-sm text-blue-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 상담시간 09:00~18:00 (평일)
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  5. Stats Bar                                                    */}
      {/* ================================================================ */}
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

      {/* ================================================================ */}
      {/*  6. Vehicle Types (12 types)                                     */}
      {/* ================================================================ */}
      <section id="vehicles" className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              차량 안내
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              12가지 차량 중 인원과 목적에 맞는 버스를 선택하세요
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {vehicleTypes.map((vt) => (
              <div
                key={vt.name}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#1B6FF4] hover:-translate-y-0.5 hover:shadow-lg group"
              >
                {/* Image placeholder - gradient simulating bus photo */}
                <div className="h-28 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
                  <span className="text-4xl">{vt.emoji}</span>
                  {/* Amenity badges */}
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {vt.amenities.map((a) => (
                      <span key={a} className="text-[10px] bg-white/90 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#1B6FF4] transition-colors">{vt.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{vt.seats}</p>
                  <p className="text-sm font-extrabold text-[#1B6FF4] mt-2">{vt.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  7. Use Cases (이용 사례)                                         */}
      {/* ================================================================ */}
      <section id="use-cases" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              이용 사례
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              다양한 목적에 맞는 전세버스 서비스를 제공합니다
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="bg-[#F8FAFC] rounded-xl border border-gray-100 p-6 text-center hover:border-[#1B6FF4] hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="text-4xl mb-3">{uc.emoji}</div>
                <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#1B6FF4] transition-colors">
                  {uc.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{uc.desc}</p>
                <Link
                  href={`/customer/quote-request?purpose=${encodeURIComponent(uc.tag)}`}
                  className="inline-flex items-center text-sm font-semibold text-[#1B6FF4] hover:underline"
                >
                  견적 받기 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  8. How It Works                                                 */}
      {/* ================================================================ */}
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

      {/* ================================================================ */}
      {/*  9. Premium Care / Safety                                        */}
      {/* ================================================================ */}
      <section id="trust" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              프리미엄 케어
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              버스고만의 6가지 안심 장치로 걱정 없는 버스 대절
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {premiumCareItems.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-[#F8FAFC] rounded-xl p-6 border border-gray-100 hover:border-[#1B6FF4]/30 hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#E8F1FE] rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Blue info banner */}
          <div className="bg-[#E8F1FE] border border-[#1B6FF4]/20 rounded-xl p-5 text-center">
            <p className="text-[#1B6FF4] font-semibold text-sm sm:text-base">
              💡 부대비용(톨비, 주차비, 식사비) 모두 포함된 견적을 받으세요. 추가금 0원!
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  10. Pension+Bus Package                                         */}
      {/* ================================================================ */}
      <section id="packages" className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] text-sm font-bold rounded-full mb-3">
              NEW
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              펜션 + 버스 패키지
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              숙박과 단체 이동을 한번에! 별도 예약보다 최대 30% 저렴
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
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
                      <span className="text-2xl font-extrabold text-[#FF6B35]">{pkg.price}원</span>
                      <span className="text-sm text-gray-500">/1인</span>
                    </div>
                    <Link
                      href="/customer/packages"
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
              href="/customer/packages"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF6B35] hover:bg-[#e55a28] text-white font-bold rounded-xl transition-colors"
            >
              🏕️ 전체 패키지 보기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  11. Reviews                                                     */}
      {/* ================================================================ */}
      <section id="reviews" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              실제 이용 후기
            </h2>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-900 font-bold text-lg">평균 평점 4.9</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600">총 12,847개 후기</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Date + Purpose tag */}
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-xs text-gray-400">{review.date}</p>
                  <span className="text-[11px] bg-[#F8FAFC] text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    {review.purpose}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  12. FAQ                                                         */}
      {/* ================================================================ */}
      <section id="faq" className="bg-[#F8FAFC] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              자주 묻는 질문
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              궁금한 점이 있으신가요?
            </p>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  13. Partner CTAs                                                */}
      {/* ================================================================ */}
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
              href="/customer/packages"
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

      {/* ================================================================ */}
      {/*  14. App Download CTA                                            */}
      {/* ================================================================ */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            앱으로 더 편리하게
          </h2>
          <p className="text-gray-300 mb-8 text-base sm:text-lg">
            실시간 견적 알림 · 예약 관리 · 기사님 실시간 위치 확인
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Download className="w-6 h-6" />
              <div className="text-left">
                <p className="text-[10px] text-gray-500 leading-none">Download on the</p>
                <p className="text-sm font-bold leading-tight">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Download className="w-6 h-6" />
              <div className="text-left">
                <p className="text-[10px] text-gray-500 leading-none">GET IT ON</p>
                <p className="text-sm font-bold leading-tight">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  15. Footer                                                      */}
      {/* ================================================================ */}
      <footer className="bg-[#0F172A] text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Logo + Company info */}
            <div>
              <span className="text-xl font-extrabold text-white">🚌 버스고</span>
              <p className="mt-4 text-sm leading-relaxed">
                전국 1등 버스대절 가격비교 플랫폼
                <br />
                펜션+버스 패키지 서비스
              </p>
              <div className="mt-4 space-y-1.5 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> 1588-5252
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> 평일 09:00~18:00
                </p>
              </div>
            </div>

            {/* Column 1: Service */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">서비스</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/customer/quote-request" className="hover:text-white transition-colors">
                    버스 대절
                  </Link>
                </li>
                <li>
                  <Link href="/customer/packages" className="hover:text-white transition-colors">
                    펜션+버스 패키지
                  </Link>
                </li>
                <li><span className="text-gray-500">정기 셔틀</span></li>
                <li><span className="text-gray-500">통근 버스</span></li>
              </ul>
            </div>

            {/* Column 2: Partner */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">파트너</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/auth?role=driver" className="hover:text-white transition-colors">
                    기사 가입
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-white transition-colors">
                    펜션 사업주 가입
                  </Link>
                </li>
                <li><span className="text-gray-500">제휴 문의</span></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">고객지원</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button onClick={() => scrollTo('#faq')} className="hover:text-white transition-colors">
                    FAQ
                  </button>
                </li>
                <li><span className="text-gray-500">이용약관</span></li>
                <li><span className="text-gray-500">개인정보처리방침</span></li>
              </ul>
            </div>
          </div>

          {/* Business info */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              (주)버스고 | 대표: 홍길동 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 제2026-서울강남-00000호
              <br />
              서울특별시 강남구 테헤란로 123, 4층 | 고객센터: 1588-5252 | 이메일: help@busgo.kr
            </p>
            <p className="text-center text-sm text-gray-500">
              &copy; 2026 버스고. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
