'use client';

import Link from 'next/link';
import {
  User,
  Phone,
  Mail,
  Building,
  Truck,
  Wallet,
  Star,
  ShieldCheck,
  CreditCard,
  LogOut,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';

const driverProfile = {
  name: '홍길동',
  phone: '010-1234-5678',
  email: 'hong@callbus.kr',
  company: '콜버스 운수',
};

const driverStats = {
  totalTrips: 127,
  avgRating: 4.8,
  reviewCount: 89,
};

const bankInfo = {
  bank: '국민은행',
  account: '123-456-****-789',
  holder: '홍길동',
};

const quickLinks = [
  { label: '차량 관리', href: '/driver/vehicles', icon: Truck, color: 'text-[#1B6FF4]', bg: 'bg-blue-50' },
  { label: '정산 내역', href: '/driver/settlements', icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: '리뷰 관리', href: '/driver/reviews', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: '보험 재검증', href: '#', icon: ShieldCheck, color: 'text-[#10B981]', bg: 'bg-green-50' },
];

export default function MypagePage() {
  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>

      {/* Profile Section */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#1B6FF4] flex items-center justify-center text-white text-2xl font-bold">
              {driverProfile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{driverProfile.name}</h2>
              <p className="text-sm text-gray-500">{driverProfile.company}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{driverProfile.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{driverProfile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{driverProfile.company}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <div className="p-4">
            <TrendingUp className="w-6 h-6 text-[#1B6FF4] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{driverStats.totalTrips}</p>
            <p className="text-xs text-gray-500">총 운행</p>
          </div>
        </Card>
        <Card className="text-center">
          <div className="p-4">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{driverStats.avgRating}</p>
            <p className="text-xs text-gray-500">평균 평점</p>
          </div>
        </Card>
        <Card className="text-center">
          <div className="p-4">
            <User className="w-6 h-6 text-[#10B981] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{driverStats.reviewCount}</p>
            <p className="text-xs text-gray-500">리뷰 수</p>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="mb-6">
        <div className="divide-y divide-gray-100">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.label} href={link.href}>
                <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full ${link.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${link.color}`} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-900">{link.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Insurance Status */}
      <Card className="mb-6">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">보험 상태</h3>
                <p className="text-xs text-gray-500">다음 갱신일: 2026-12-31</p>
              </div>
            </div>
            <Badge variant="success" size="sm" dot>보험 유효</Badge>
          </div>
        </div>
      </Card>

      {/* Bank Info */}
      <Card className="mb-6">
        <div className="p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            정산 계좌 정보
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">은행</span>
              <span className="text-gray-900 font-medium">{bankInfo.bank}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">계좌번호</span>
              <span className="text-gray-900 font-medium">{bankInfo.account}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">예금주</span>
              <span className="text-gray-900 font-medium">{bankInfo.holder}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Logout */}
      <Button variant="outline" fullWidth size="lg" className="mb-6">
        <LogOut className="w-5 h-5" />
        로그아웃
      </Button>
    </div>
  );
}
