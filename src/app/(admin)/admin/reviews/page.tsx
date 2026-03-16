'use client';

import { useState } from 'react';
import { Star, EyeOff, Trash2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TabList, Tab } from '@/components/ui/Tabs';

interface Review {
  id: string;
  reviewer: string;
  type: 'driver' | 'pension';
  targetName: string;
  rating: number;
  content: string;
  date: string;
  status: 'visible' | 'hidden' | 'reported';
  verified: boolean;
}

const mockReviews: Review[] = [
  { id: '1', reviewer: '김철수', type: 'driver', targetName: '김대현 기사', rating: 5, content: '매우 친절하고 안전운전 해주셨습니다. 다음에도 꼭 이 기사님으로 지정하고 싶어요.', date: '2026-03-15', status: 'visible', verified: true },
  { id: '2', reviewer: '이영미', type: 'pension', targetName: '솔바람 펜션', rating: 4, content: '시설이 깨끗하고 전망이 좋았습니다. 조식이 더 다양했으면 좋겠어요.', date: '2026-03-14', status: 'visible', verified: false },
  { id: '3', reviewer: '박지은', type: 'driver', targetName: '박영수 기사', rating: 3, content: '시간은 잘 맞췄는데 차량 내부가 좀 더러웠습니다.', date: '2026-03-13', status: 'visible', verified: true },
  { id: '4', reviewer: '최민호', type: 'pension', targetName: '해오름 리조트', rating: 5, content: '뷰가 정말 환상적입니다! 직원분들도 매우 친절하셨어요. 강력 추천합니다.', date: '2026-03-12', status: 'visible', verified: false },
  { id: '5', reviewer: '정수현', type: 'driver', targetName: '이준호 기사', rating: 1, content: '운전이 너무 거칠고 불친절했습니다. 다시는 이용하고 싶지 않습니다.', date: '2026-03-11', status: 'reported', verified: true },
  { id: '6', reviewer: '한지영', type: 'pension', targetName: '별빛 풀빌라', rating: 4, content: '프라이빗한 공간이 매력적이에요. 가격 대비 만족합니다.', date: '2026-03-10', status: 'visible', verified: false },
  { id: '7', reviewer: '윤서준', type: 'driver', targetName: '김대현 기사', rating: 5, content: '항상 만족합니다. 최고의 기사님!', date: '2026-03-09', status: 'visible', verified: true },
  { id: '8', reviewer: '강예진', type: 'pension', targetName: '초록숲 글램핑', rating: 2, content: '사진과 너무 다릅니다. 시설이 노후되어 실망했습니다.', date: '2026-03-08', status: 'reported', verified: false },
];

const statusConfig: Record<string, { variant: 'success' | 'default' | 'danger'; label: string }> = {
  visible: { variant: 'success', label: '공개' },
  hidden: { variant: 'default', label: '숨김' },
  reported: { variant: 'danger', label: '신고됨' },
};

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  const filtered = reviews.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'driver') return r.type === 'driver';
    if (activeTab === 'pension') return r.type === 'pension';
    if (activeTab === 'reported') return r.status === 'reported';
    return true;
  });

  const handleHide = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'hidden' as const } : r)));
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
        <p className="mt-1 text-sm text-gray-500">리뷰를 관리하고 신고된 리뷰를 처리합니다.</p>
      </div>

      <TabList activeValue={activeTab} onChange={setActiveTab}>
        <Tab value="all">전체 ({reviews.length})</Tab>
        <Tab value="driver">기사리뷰 ({reviews.filter((r) => r.type === 'driver').length})</Tab>
        <Tab value="pension">펜션리뷰 ({reviews.filter((r) => r.type === 'pension').length})</Tab>
        <Tab value="reported">신고됨 ({reviews.filter((r) => r.status === 'reported').length})</Tab>
      </TabList>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">작성자</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">대상</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">평점</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">내용</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">날짜</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <Star className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const sc = statusConfig[r.status];
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{r.reviewer}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                        <div className="flex items-center gap-2">
                          {r.targetName}
                          {r.verified && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600">
                              <ShieldCheck className="h-3 w-3" />운행인증
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">{renderStars(r.rating)}</td>
                      <td className="px-6 py-3 text-gray-700 max-w-xs truncate">{r.content}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500">{r.date}</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex gap-1">
                          {r.status !== 'hidden' && (
                            <Button size="sm" variant="ghost" onClick={() => handleHide(r.id)}>
                              <EyeOff className="h-3.5 w-3.5" />숨김처리
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />삭제
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((r) => {
          const sc = statusConfig[r.status];
          return (
            <Card key={r.id} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{r.reviewer}</p>
                    {r.verified && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600">
                        <ShieldCheck className="h-3 w-3" />운행인증
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{r.targetName}</p>
                </div>
                <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
              </div>
              <div className="mt-1">{renderStars(r.rating)}</div>
              <p className="mt-2 text-sm text-gray-700 line-clamp-2">{r.content}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">{r.date}</span>
                <div className="flex gap-2">
                  {r.status !== 'hidden' && (
                    <Button size="sm" variant="ghost" onClick={() => handleHide(r.id)}>숨김</Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
