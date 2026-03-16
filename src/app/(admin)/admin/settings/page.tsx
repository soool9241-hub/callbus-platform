'use client';

import { useState } from 'react';
import {
  Save,
  Plus,
  Pencil,
  Trash2,
  Bell,
  MapPin,
  Percent,
  ShieldAlert,
  Megaphone,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

// ── Types ────────────────────────────────────────────────────────────────────

interface CancelPolicy {
  id: number;
  label: string;
  refundRate: number;
}

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface Region {
  id: number;
  name: string;
  active: boolean;
}

interface Announcement {
  id: number;
  title: string;
  date: string;
  published: boolean;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const initialCancelPolicies: CancelPolicy[] = [
  { id: 1, label: 'D-7 이전', refundRate: 100 },
  { id: 2, label: 'D-3 ~ D-7', refundRate: 50 },
  { id: 3, label: 'D-1 ~ D-3', refundRate: 20 },
  { id: 4, label: 'D-Day', refundRate: 0 },
];

const initialNotifications: NotifSetting[] = [
  { id: 'new_quote', label: '새 견적 요청', description: '새로운 견적 요청이 들어오면 알림', enabled: true },
  { id: 'quote_submitted', label: '견적 제출', description: '기사가 견적을 제출하면 알림', enabled: true },
  { id: 'reservation_confirmed', label: '예약 확정', description: '예약이 확정되면 알림', enabled: true },
  { id: 'cancel_request', label: '취소 요청', description: '고객이 취소를 요청하면 알림', enabled: true },
  { id: 'driver_signup', label: '기사 가입 신청', description: '새로운 기사가 가입 신청하면 알림', enabled: false },
  { id: 'settlement_ready', label: '정산 준비 완료', description: '정산 주기가 완료되면 알림', enabled: true },
];

const initialRegions: Region[] = [
  { id: 1, name: '서울특별시', active: true },
  { id: 2, name: '경기도', active: true },
  { id: 3, name: '인천광역시', active: true },
  { id: 4, name: '부산광역시', active: true },
  { id: 5, name: '대구광역시', active: true },
  { id: 6, name: '대전광역시', active: false },
  { id: 7, name: '광주광역시', active: false },
  { id: 8, name: '강원도', active: true },
  { id: 9, name: '충청남도', active: false },
  { id: 10, name: '전라남도', active: false },
  { id: 11, name: '경상남도', active: true },
  { id: 12, name: '제주특별자치도', active: true },
];

const initialAnnouncements: Announcement[] = [
  { id: 1, title: '2026년 봄 시즌 프로모션 안내', date: '2026-03-15', published: true },
  { id: 2, title: '시스템 점검 안내 (3/20)', date: '2026-03-14', published: true },
  { id: 3, title: '기사 수수료 정책 변경 안내', date: '2026-03-10', published: false },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [feeRate, setFeeRate] = useState('10');
  const [cancelPolicies] = useState(initialCancelPolicies);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [regions, setRegions] = useState(initialRegions);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // Announcement modal state
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementTitle, setAnnouncementTitle] = useState('');

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const toggleRegion = (id: number) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const openAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementTitle('');
    setAnnouncementModalOpen(true);
  };

  const openEditAnnouncement = (a: Announcement) => {
    setEditingAnnouncement(a);
    setAnnouncementTitle(a.title);
    setAnnouncementModalOpen(true);
  };

  const saveAnnouncement = () => {
    if (!announcementTitle.trim()) return;
    if (editingAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingAnnouncement.id ? { ...a, title: announcementTitle } : a
        )
      );
    } else {
      const newA: Announcement = {
        id: Date.now(),
        title: announcementTitle,
        date: new Date().toISOString().slice(0, 10),
        published: false,
      };
      setAnnouncements((prev) => [newA, ...prev]);
    }
    setAnnouncementModalOpen(false);
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const togglePublish = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, published: !a.published } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
        <p className="mt-1 text-sm text-gray-500">플랫폼 운영에 필요한 설정을 관리합니다.</p>
      </div>

      {/* Fee Setting */}
      <Card padding="md">
        <div className="mb-4 flex items-center gap-2">
          <Percent className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">수수료 설정</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">기본 수수료율을 설정합니다. 변경 시 다음 정산 주기부터 적용됩니다.</p>
        <div className="flex items-end gap-3">
          <div className="w-32">
            <Input
              label="기본 수수료율 (%)"
              type="number"
              min="0"
              max="100"
              value={feeRate}
              onChange={(e) => setFeeRate(e.target.value)}
            />
          </div>
          <Button variant="primary">
            <Save className="h-4 w-4" />
            저장
          </Button>
        </div>
      </Card>

      {/* Cancel Policy */}
      <Card padding="md">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">취소 규정</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">예약 취소 시 환불 비율을 설정합니다.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">취소 시점</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">환불율</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cancelPolicies.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-3 font-medium text-gray-900">{p.label}</td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={`text-lg font-bold ${
                        p.refundRate === 100
                          ? 'text-green-600'
                          : p.refundRate >= 50
                          ? 'text-yellow-600'
                          : p.refundRate > 0
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    >
                      {p.refundRate}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-gray-400">
                    {p.refundRate === 100
                      ? '전액 환불'
                      : p.refundRate === 0
                      ? '환불 불가'
                      : `${100 - p.refundRate}% 차감`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card padding="md">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">알림 설정</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">관리자 알림 수신 여부를 설정합니다.</p>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-400">{n.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(n.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  n.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={n.enabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    n.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Region Management */}
      <Card padding="md">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">지역 관리</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">서비스 제공 지역을 활성/비활성 처리합니다.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <div
              key={r.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                r.active ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${r.active ? 'text-green-500' : 'text-gray-300'}`} />
                <span className={`text-sm font-medium ${r.active ? 'text-gray-900' : 'text-gray-400'}`}>
                  {r.name}
                </span>
              </div>
              <button
                onClick={() => toggleRegion(r.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  r.active ? 'bg-green-500' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={r.active}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    r.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Announcements */}
      <Card padding="md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">공지사항 관리</h2>
          </div>
          <Button size="sm" variant="primary" onClick={openAddAnnouncement}>
            <Plus className="h-4 w-4" />
            추가
          </Button>
        </div>
        <div className="space-y-2">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant={a.published ? 'success' : 'default'}
                  size="sm"
                  dot
                >
                  {a.published ? '게시중' : '미게시'}
                </Badge>
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.date}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => togglePublish(a.id)}>
                  {a.published ? '숨기기' : '게시'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEditAnnouncement(a)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteAnnouncement(a.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">등록된 공지사항이 없습니다.</p>
          )}
        </div>
      </Card>

      {/* Announcement Modal */}
      <Modal
        open={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        title={editingAnnouncement ? '공지사항 수정' : '공지사항 추가'}
        footer={
          <>
            <Button variant="outline" onClick={() => setAnnouncementModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={saveAnnouncement}>
              <Save className="h-4 w-4" />
              {editingAnnouncement ? '수정' : '추가'}
            </Button>
          </>
        }
      >
        <Input
          label="공지사항 제목"
          value={announcementTitle}
          onChange={(e) => setAnnouncementTitle(e.target.value)}
          placeholder="공지사항 제목을 입력하세요"
        />
      </Modal>
    </div>
  );
}
