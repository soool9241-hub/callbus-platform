'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Calendar,
  CalendarDays,
  Truck,
  Wallet,
  Star,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Footer from './Footer';

type Role = 'customer' | 'driver' | 'admin' | 'pension_owner';

const roleLabels: Record<Role, string> = {
  customer: '고객',
  driver: '기사',
  admin: '관리자',
  pension_owner: '펜션사업자',
};

const driverNavItems = [
  { label: '홈', href: '/driver/dashboard', icon: LayoutDashboard },
  { label: '견적 제출', href: '/driver/quote-submit', icon: FileText },
  { label: '내 예약', href: '/driver/reservations', icon: Calendar },
  { label: '일정 관리', href: '/driver/schedule', icon: CalendarDays },
  { label: '차량 관리', href: '/driver/vehicles', icon: Truck },
  { label: '정산', href: '/driver/settlements', icon: Wallet },
  { label: '리뷰', href: '/driver/reviews', icon: Star },
  { label: '채팅', href: '/driver/chat', icon: MessageSquare },
  { label: '알림', href: '/driver/notifications', icon: Bell },
  { label: '마이페이지', href: '/driver/mypage', icon: User },
];

interface DriverLayoutProps {
  children: React.ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentRole, setCurrentRole, currentUser, unreadCount } = useStore();

  const roles: Role[] = ['customer', 'driver', 'admin'];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Driver Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - green accent for driver */}
            <Link href="/driver/dashboard" className="flex items-center gap-1 text-2xl font-bold text-green-600">
              🚌 콜버스
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {driverNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {roleLabels[currentRole]}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setCurrentRole(role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          currentRole === role ? 'text-green-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {roleLabels[role]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar / Login */}
              {currentUser ? (
                <Link
                  href="/driver/mypage"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  로그인
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {driverNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              {/* Mobile role switcher */}
              <div className="pt-3 border-t border-gray-100">
                <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">뷰 전환</p>
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                      currentRole === role
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {roleLabels[role]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
