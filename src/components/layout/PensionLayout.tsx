'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Home,
  Package,
  Bus,
  Calendar,
  Wallet,
  Star,
  Settings,
  Bell,
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Footer from './Footer';

type Role = 'customer' | 'driver' | 'admin' | 'pension_owner';

const roleLabels: Record<Role, string> = {
  customer: '고객',
  driver: '기사',
  admin: '관리자',
  pension_owner: '펜션사업주',
};

const pensionNavItems = [
  { name: '대시보드', href: '/pension/dashboard', icon: BarChart3 },
  { name: '펜션 관리', href: '/pension/pensions', icon: Home },
  { name: '패키지 관리', href: '/pension/packages', icon: Package },
  { name: '셔틀 관리', href: '/pension/shuttles', icon: Bus },
  { name: '예약 관리', href: '/pension/bookings', icon: Calendar },
  { name: '정산', href: '/pension/settlements', icon: Wallet },
  { name: '리뷰', href: '/pension/reviews', icon: Star },
  { name: '마이페이지', href: '/pension/settings', icon: Settings },
];

interface PensionLayoutProps {
  children: React.ReactNode;
}

export default function PensionLayout({ children }: PensionLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { currentRole, setCurrentRole, currentUser, unreadCount } = useStore();

  const roles: Role[] = ['customer', 'driver', 'pension_owner', 'admin'];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function isActive(href: string): boolean {
    if (href === '/pension/dashboard') return pathname === '/pension/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Pension Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - amber accent for pension owner */}
            <Link href="/pension/dashboard" className="flex items-center gap-1 text-2xl font-bold text-amber-600">
              콜버스
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {pensionNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      active ? 'text-amber-600' : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
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
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setCurrentRole(role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          currentRole === role ? 'text-amber-600 font-semibold' : 'text-gray-700'
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
                  href="/pension/settings"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
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
              {pensionNavItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                      active
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-amber-600' : 'text-gray-400'}`} />
                    {item.name}
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
                        ? 'text-amber-600 bg-amber-50'
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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="grid grid-cols-5 gap-0">
          {pensionNavItems.slice(0, 5).map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 text-xs transition-colors ${
                  active ? 'text-amber-600' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
