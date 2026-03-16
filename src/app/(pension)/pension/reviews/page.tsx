'use client';

import { useState } from 'react';
import {
  Star,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { StarRating } from '@/components/ui/StarRating';
import { Modal } from '@/components/ui/Modal';

const mockReviews = [
  {
    id: 'rv-001',
    customerName: '김민수',
    rating: 5,
    content: '정말 최고의 펜션이었습니다! 자연 경관이 너무 좋고 바베큐 시설도 훌륭했어요. 버스도 편안했습니다. 다음에 또 오겠습니다!',
    date: '2026-03-15',
    packageName: '가평 힐링 1박2일 패키지',
    reply: '감사합니다! 다음에도 좋은 시간 보내실 수 있도록 준비하겠습니다.',
  },
  {
    id: 'rv-002',
    customerName: '이서연',
    rating: 4,
    content: '전체적으로 만족스러운 여행이었습니다. 다만 체크인 시간이 조금 늦어진 것이 아쉬웠어요. 그래도 직원분들이 친절해서 좋았습니다.',
    date: '2026-03-12',
    packageName: '가평 힐링 1박2일 패키지',
    reply: '',
  },
  {
    id: 'rv-003',
    customerName: '박준혁',
    rating: 5,
    content: '회사 워크숍으로 이용했는데 세미나실도 깨끗하고 바베큐도 맛있었습니다. 팀원들 모두 만족했어요.',
    date: '2026-03-10',
    packageName: '가평 힐링 1박2일 패키지',
    reply: '',
  },
  {
    id: 'rv-004',
    customerName: '최하영',
    rating: 3,
    content: '시설은 괜찮았지만 가격 대비 좀 아쉬운 부분이 있었습니다. 수영장 관리가 조금 더 되었으면 합니다.',
    date: '2026-03-08',
    packageName: '속초 바다 워크숍 패키지',
    reply: '',
  },
  {
    id: 'rv-005',
    customerName: '정민호',
    rating: 5,
    content: '가족 여행으로 다녀왔는데 아이들도 너무 좋아했어요. 족구장에서 신나게 놀았습니다. 강력 추천합니다!',
    date: '2026-03-05',
    packageName: '가평 힐링 1박2일 패키지',
    reply: '가족분들과 즐거운 시간 보내셔서 기쁩니다! 언제든 환영합니다.',
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: Math.round(
      (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
    ),
  }));

  const handleOpenReply = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    const existing = reviews.find((r) => r.id === reviewId)?.reply || '';
    setReplyText(existing);
    setReplyModalOpen(true);
  };

  const handleSubmitReply = () => {
    if (selectedReviewId) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === selectedReviewId ? { ...r, reply: replyText } : r
        )
      );
    }
    setReplyModalOpen(false);
    setReplyText('');
    setSelectedReviewId(null);
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
      </div>

      {/* Rating Summary */}
      <Card className="mb-8">
        <div className="p-5">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Average Score */}
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </p>
              <StarRating value={averageRating} readOnly size="lg" />
              <p className="text-sm text-gray-500 mt-2">{reviews.length}개 리뷰</p>
            </div>

            {/* Distribution */}
            <div className="flex-1 w-full space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-8">{star}점</span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.customerName}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <StarRating value={review.rating} readOnly size="sm" />
              </div>

              <Badge variant="info" size="sm" className="mb-2">
                {review.packageName}
              </Badge>

              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {review.content}
              </p>

              {/* Reply */}
              {review.reply ? (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <p className="text-xs text-[#1B6FF4] font-medium mb-1">사장님 답변</p>
                  <p className="text-sm text-gray-700">{review.reply}</p>
                </div>
              ) : null}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenReply(review.id)}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {review.reply ? '답변 수정' : '답변 작성'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Reply Modal */}
      <Modal
        open={replyModalOpen}
        onClose={() => {
          setReplyModalOpen(false);
          setReplyText('');
          setSelectedReviewId(null);
        }}
        title="답변 작성"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setReplyModalOpen(false);
                setReplyText('');
                setSelectedReviewId(null);
              }}
            >
              취소
            </Button>
            <Button variant="primary" onClick={handleSubmitReply}>
              <Send className="w-4 h-4" />
              답변 등록
            </Button>
          </>
        }
      >
        <Textarea
          label="답변 내용"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="고객님께 감사의 답변을 작성하세요"
          rows={4}
        />
      </Modal>
    </div>
  );
}
