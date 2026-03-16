'use client';

import { useState } from 'react';
import { Megaphone, Plus, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TabList, Tab } from '@/components/ui/Tabs';

interface Notice {
  id: string;
  title: string;
  target: '고객' | '기사' | '펜션' | '전체';
  date: string;
  views: number;
}

interface FAQ {
  id: string;
  question: string;
  category: string;
  order: number;
}

const mockNotices: Notice[] = [
  { id: '1', title: '2026년 봄 시즌 운영 안내', target: '전체', date: '2026-03-15', views: 1245 },
  { id: '2', title: '펜션 파트너 수수료 정책 변경 안내', target: '펜션', date: '2026-03-10', views: 342 },
  { id: '3', title: '셔틀 운행 시간 조정 안내 (4월~)', target: '기사', date: '2026-03-08', views: 567 },
  { id: '4', title: '앱 업데이트 안내 v2.5.0', target: '고객', date: '2026-03-01', views: 2103 },
  { id: '5', title: '설 연휴 고객센터 운영 시간 안내', target: '전체', date: '2026-01-20', views: 3891 },
];

const mockFaqs: FAQ[] = [
  { id: '1', question: '예약 취소는 어떻게 하나요?', category: '예약', order: 1 },
  { id: '2', question: '결제 수단은 무엇이 있나요?', category: '결제', order: 2 },
  { id: '3', question: '셔틀 탑승 위치는 어디인가요?', category: '셔틀', order: 3 },
  { id: '4', question: '펜션 파트너 등록은 어떻게 하나요?', category: '파트너', order: 4 },
  { id: '5', question: '환불 정책이 궁금합니다.', category: '결제', order: 5 },
];

const targetBadge: Record<string, 'info' | 'success' | 'warning' | 'purple'> = {
  '고객': 'info',
  '기사': 'success',
  '펜션': 'warning',
  '전체': 'purple',
};

export default function NoticesPage() {
  const [activeTab, setActiveTab] = useState('notices');
  const [notices] = useState<Notice[]>(mockNotices);
  const [faqs] = useState<FAQ[]>(mockFaqs);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지사항/FAQ</h1>
          <p className="mt-1 text-sm text-gray-500">공지사항과 자주 묻는 질문을 관리합니다.</p>
        </div>
        <Button variant="primary">
          <Plus className="h-4 w-4" />새 글 작성
        </Button>
      </div>

      <TabList activeValue={activeTab} onChange={setActiveTab}>
        <Tab value="notices">공지사항 ({notices.length})</Tab>
        <Tab value="faq">FAQ ({faqs.length})</Tab>
      </TabList>

      {activeTab === 'notices' && (
        <>
          {/* Desktop table */}
          <Card padding="none" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-500">제목</th>
                    <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">대상</th>
                    <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">작성일</th>
                    <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">조회수</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {notices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                        <Megaphone className="mx-auto mb-2 h-8 w-8" />
                        데이터가 없습니다
                      </td>
                    </tr>
                  ) : (
                    notices.map((n) => (
                      <tr key={n.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                        <td className="px-6 py-3 font-medium text-gray-900">{n.title}</td>
                        <td className="whitespace-nowrap px-6 py-3">
                          <Badge variant={targetBadge[n.target]} size="sm">{n.target}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-500">{n.date}</td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-500">{n.views.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {notices.map((n) => (
              <Card key={n.id} padding="md">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-gray-900">{n.title}</p>
                  <Badge variant={targetBadge[n.target]} size="sm">{n.target}</Badge>
                </div>
                <div className="mt-2 flex gap-4 text-sm text-gray-500">
                  <span>{n.date}</span>
                  <span>조회 {n.views.toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'faq' && (
        <>
          {/* Desktop table */}
          <Card padding="none" className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">순서</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">질문</th>
                    <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">카테고리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {faqs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                        데이터가 없습니다
                      </td>
                    </tr>
                  ) : (
                    faqs.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                        <td className="whitespace-nowrap px-6 py-3 text-gray-500">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-300 cursor-grab" />
                            {f.order}
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-900">{f.question}</td>
                        <td className="whitespace-nowrap px-6 py-3">
                          <Badge variant="default" size="sm">{f.category}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {faqs.map((f) => (
              <Card key={f.id} padding="md">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-gray-900">{f.question}</p>
                  <Badge variant="default" size="sm">{f.category}</Badge>
                </div>
                <p className="mt-1 text-xs text-gray-400">순서: {f.order}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
