'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Role = 'customer' | 'driver' | 'admin';

const roleLabels: Record<Role, string> = {
  customer: '고객',
  driver: '기사',
  admin: '관리자',
};

const customerNavItems = [
  { label: '홈', href: '/' },
  { label: '견적신청', href: '/quote/request' },
  { label: '내 예약', href: '/reservations' },
  { label: '마이페이지', href: '/mypage' },
];

const driverNavItems = [
  { label: '견적요청', href: '/driver/requests' },
  { label: '내 견적', href: '/driver/quotes' },
  { label: '차량관리', href: '/driver/vehicles' },
  { label: '정산', href: '/driver/settlements' },
  { label: '마이페이지', href: '/driver/mypage' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { currentRole, setCurrentRole, currentUser, setCurrentUser, unreadCount } = useStore();

  const roles: Role[] = ['customer', 'driver', 'admin'];
  const navItems = currentRole === 'driver' ? driverNavItems : customerNavItems;
  const accentColor = currentRole === 'driver' ? 'text-green-600' : 'text-blue-600';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast.success('로그아웃되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className={`flex items-center gap-1 text-2xl font-bold ${accentColor}`}>
            콜버스
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
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
                        currentRole === role ? 'text-blue-600 font-semibold' : 'text-gray-700'
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
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-semibold">
                    {currentUser.name ? currentUser.name.charAt(0) : <User className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {currentUser.name || '사용자'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name || '사용자'}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    <Link
                      href="/mypage"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                로그인
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile role switcher */}
            <div className="pt-3 border-t border-gray-100">
              <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">뷰 전환</p>
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentRole(role);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                    currentRole === role
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {roleLabels[role]}
                </button>
              ))}
            </div>
            {/* Mobile logout */}
            {currentUser && (
              <div className="pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
