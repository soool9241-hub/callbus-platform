'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
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
  X,
  Loader2,
} from 'lucide-react';

export default function MyPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { currentUser, setCurrentUser } = useStore();

  const [quoteCount, setQuoteCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !currentUser) return;

    async function fetchCounts() {
      try {
        const [quotesResult, reservationsResult] = await Promise.all([
          supabase
            .from('quote_requests')
            .select('id', { count: 'exact', head: true })
            .eq('customer_id', currentUser!.id),
          supabase
            .from('reservations')
            .select('id', { count: 'exact', head: true })
            .eq('customer_id', currentUser!.id),
        ]);
        if (quotesResult.count != null) setQuoteCount(quotesResult.count);
        if (reservationsResult.count != null) setReservationCount(reservationsResult.count);
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    }

    fetchCounts();
  }, [isLoggedIn, currentUser]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast.success('로그아웃되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleEditProfile = () => {
    setEditName(currentUser?.name || '');
    setEditPhone(currentUser?.phone || '');
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: editName, phone: editPhone })
        .eq('id', currentUser.id);

      if (error) throw error;

      setCurrentUser({
        ...currentUser,
        name: editName,
        phone: editPhone,
      });
      toast.success('프로필이 수정되었습니다.');
      setEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleMenuClick = (label: string) => {
    alert(`${label} 페이지는 준비 중입니다.`);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
        <p className="text-gray-500 mb-6">마이페이지를 이용하려면 로그인해 주세요.</p>
        <Link href="/auth">
          <Button className="bg-blue-600 hover:bg-blue-700">로그인하기</Button>
        </Link>
      </div>
    );
  }

  const menuItems = [
    {
      icon: FileText,
      label: '내 견적 요청',
      href: '/quotes',
      badge: quoteCount > 0 ? quoteCount.toString() : null,
      badgeVariant: 'info' as const,
    },
    {
      icon: Calendar,
      label: '내 예약',
      href: '/reservations',
      badge: reservationCount > 0 ? reservationCount.toString() : null,
      badgeVariant: 'success' as const,
    },
    {
      icon: Bell,
      label: '알림 설정',
      href: null,
      badge: null,
      badgeVariant: 'default' as const,
    },
    {
      icon: Ticket,
      label: '쿠폰함',
      href: null,
      badge: null,
      badgeVariant: 'purple' as const,
    },
    {
      icon: Megaphone,
      label: '공지사항',
      href: null,
      badge: null,
      badgeVariant: 'default' as const,
    },
    {
      icon: Headphones,
      label: '고객센터',
      href: null,
      badge: null,
      badgeVariant: 'default' as const,
    },
  ];

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
            <h2 className="text-lg font-bold text-gray-900">{currentUser.name || '사용자'}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <Phone className="w-3.5 h-3.5" />
              {currentUser.phone || '전화번호 미등록'}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="w-3.5 h-3.5" />
              {currentUser.email || '이메일 미등록'}
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

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">프로필 수정</h3>
              <button onClick={() => setEditing(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="이름"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
              <Input
                label="전화번호"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setEditing(false)}
              >
                취소
              </Button>
              <Button
                fullWidth
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Menu List */}
      <Card padding="none" className="mb-6 overflow-hidden">
        {menuItems.map((item, i) => {
          const content = (
            <>
              <item.icon className="w-5 h-5 text-gray-400" />
              <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
              {item.badge && (
                <Badge variant={item.badgeVariant} size="sm">
                  {item.badge}
                </Badge>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </>
          );

          const className = `w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left ${
            i > 0 ? 'border-t border-gray-100' : ''
          }`;

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={className}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item.label)}
              className={className}
            >
              {content}
            </button>
          );
        })}
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
