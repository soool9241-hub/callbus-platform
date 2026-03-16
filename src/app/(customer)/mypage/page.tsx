'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockQuoteRequests, mockReservations } from '@/lib/mock-data';
import {
  User,
  FileText,
  Calendar,
  Bell,
  Ticket,
  Megaphone,
  Headphones,
  ScrollText,
  LogOut,
  ChevronRight,
  Camera,
  Mail,
  Phone,
} from 'lucide-react';

const mockUser = {
  name: '김민수',
  phone: '010-1234-5678',
  email: 'minsu.kim@email.com',
  avatar: null as string | null,
};

export default function MyPage() {
  const quoteCount = mockQuoteRequests.length;
  const reservationCount = mockReservations.length;

  const menuItems = [
    {
      icon: FileText,
      label: '내 견적 요청',
      href: '/quotes',
      badge: quoteCount.toString(),
      badgeVariant: 'info' as const,
    },
    {
      icon: Calendar,
      label: '내 예약',
      href: '/reservations',
      badge: reservationCount.toString(),
      badgeVariant: 'success' as const,
    },
    {
      icon: Bell,
      label: '알림 설정',
      href: '#',
      badge: null,
      badgeVariant: 'default' as const,
    },
    {
      icon: Ticket,
      label: '쿠폰함',
      href: '#',
      badge: '2장',
      badgeVariant: 'purple' as const,
    },
    {
      icon: Megaphone,
      label: '공지사항',
      href: '#',
      badge: null,
      badgeVariant: 'default' as const,
    },
    {
      icon: Headphones,
      label: '고객센터',
      href: '#',
      badge: null,
      badgeVariant: 'default' as const,
    },
    {
      icon: ScrollText,
      label: '이용약관',
      href: '#',
      badge: null,
      badgeVariant: 'default' as const,
    },
  ];

  const handleEditProfile = () => {
    alert('프로필 수정 기능은 준비중입니다.');
  };

  const handleLogout = () => {
    alert('로그아웃되었습니다.');
  };

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.href === '#') {
      alert(`${item.label} 페이지는 준비중입니다.`);
    } else {
      window.location.href = item.href;
    }
  };

  return (
    <div className="py-2 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>

      {/* Profile Section */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-8 h-8" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{mockUser.name}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <Phone className="w-3.5 h-3.5" />
              {mockUser.phone}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="w-3.5 h-3.5" />
              {mockUser.email}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          fullWidth
          size="sm"
          className="mt-4"
          onClick={handleEditProfile}
        >
          프로필 수정
        </Button>
      </Card>

      {/* Menu List */}
      <Card padding="none" className="mb-6 overflow-hidden">
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => handleMenuClick(item)}
            className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left ${
              i > 0 ? 'border-t border-gray-100' : ''
            }`}
          >
            <item.icon className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
            {item.badge && (
              <Badge variant={item.badgeVariant} size="sm">
                {item.badge}
              </Badge>
            )}
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </Card>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl border border-gray-200 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        로그아웃
      </button>
    </div>
  );
}
