'use client';

import { useState } from 'react';
import { ShieldCheck, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  content: string;
  date: string;
  type: string;
  reply?: string;
}

const mockReviews: Review[] = [
  {
    id: 'rev-1',
    customerName: '김민수',
    rating: 5,
    content: '기사님이 정말 친절하시고 운전도 안전하게 해주셨습니다. 어르신들이 매우 만족하셨어요. 다음에도 꼭 이용하겠습니다!',
    date: '2026-03-15',
    type: '일반',
  },
  {
    id: 'rev-2',
    customerName: '이수진',
    rating: 4.5,
    content: '차량이 깨끗하고 시간 약속을 잘 지켜주셨습니다. 가평 펜션까지 편안하게 갈 수 있었어요.',
    date: '2026-03-12',
    type: '펜션',
    reply: '감사합니다! 다음에도 편안한 운행 약속드리겠습니다.',
  },
  {
    id: 'rev-3',
    customerName: '박지훈',
    rating: 5,
    content: '공항 셔틀 이용했는데 정시에 도착해주시고 짐도 친절하게 실어주셨습니다. 완벽한 서비스였습니다.',
    date: '2026-03-10',
    type: '셔틀',
  },
  {
    id: 'rev-4',
    customerName: '최영희',
    rating: 4,
    content: '여수 여행 잘 다녀왔습니다. 중간 휴게소도 적절히 들려주시고 여수 맛집도 추천해주셔서 좋았어요.',
    date: '2026-03-08',
    type: '패키지',
  },
  {
    id: 'rev-5',
    customerName: '정다은',
    rating: 5,
    content: '회사 워크샵 단체 이동이었는데 차량 상태도 좋고 기사님도 프로페셔널하셨습니다. 강력 추천합니다!',
    date: '2026-03-05',
    type: '일반',
  },
  {
    id: 'rev-6',
    customerName: '한승우',
    rating: 4.5,
    content: '파주 DMZ 투어였는데 설명도 곁들여주시고 사진 포인트도 알려주셔서 감사했습니다.',
    date: '2026-03-02',
    type: '패키지',
  },
];

export default function ReviewsPage() {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reviews, setReviews] = useState(mockReviews);

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply: replyText } : r))
    );
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">리뷰 관리</h1>

      {/* Average Rating Card */}
      <Card className="mb-6">
        <div className="p-6 text-center">
          <p className="text-5xl font-bold text-gray-900 mb-2">{avgRating.toFixed(1)}</p>
          <StarRating value={avgRating} size="lg" readOnly className="justify-center mb-2" />
          <p className="text-sm text-gray-500">총 {reviews.length}개 리뷰</p>
        </div>
      </Card>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{review.customerName}</span>
                  <Badge variant="info" size="sm">{review.type}</Badge>
                  <Badge variant="success" size="sm">
                    <ShieldCheck className="w-3 h-3" />
                    운행인증
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>

              {/* Rating */}
              <StarRating value={review.rating} size="sm" readOnly className="mb-2" />

              {/* Content */}
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.content}</p>

              {/* Reply */}
              {review.reply ? (
                <div className="bg-blue-50 rounded-lg p-3 border-l-3 border-[#1B6FF4]">
                  <p className="text-xs font-medium text-[#1B6FF4] mb-1">내 답변</p>
                  <p className="text-sm text-gray-700">{review.reply}</p>
                </div>
              ) : replyingTo === review.id ? (
                <div className="space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="답변을 입력하세요..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1B6FF4] focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/20 min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setReplyingTo(null); setReplyText(''); }}
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#1B6FF4] hover:bg-[#0B4FCC]"
                      onClick={() => handleSubmitReply(review.id)}
                    >
                      답변 등록
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(review.id)}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  답변하기
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
