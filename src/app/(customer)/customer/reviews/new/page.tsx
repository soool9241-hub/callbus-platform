'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { StarRating } from '@/components/ui/StarRating';
import { ArrowLeft, Camera, CheckCircle2 } from 'lucide-react';

const reservationOptions = [
  { value: '', label: '예약을 선택하세요' },
  { value: 'rsv-001', label: 'RSV-2025-0001 | 서울→속초 (2025.12.15)' },
  { value: 'rsv-002', label: 'RSV-2025-0002 | 서울→가평 (2025.11.28)' },
  { value: 'rsv-003', label: 'RSV-2025-0003 | 서울→경주 (2025.11.10)' },
];

type ReviewTarget = 'driver' | 'pension';

export default function WriteReviewPage() {
  const router = useRouter();
  const [selectedReservation, setSelectedReservation] = useState('');
  const [target, setTarget] = useState<ReviewTarget>('driver');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const handleSubmit = () => {
    if (!selectedReservation) {
      showToast('예약을 선택해주세요.');
      return;
    }
    if (rating === 0) {
      showToast('별점을 선택해주세요.');
      return;
    }
    if (!reviewText.trim()) {
      showToast('리뷰 내용을 입력해주세요.');
      return;
    }
    showToast('리뷰가 등록되었습니다. 감사합니다!');
    setTimeout(() => router.back(), 1500);
  };

  return (
    <div className="py-2 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        뒤로가기
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">리뷰 작성</h1>

      {/* Verified badge */}
      <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
        <span className="text-sm font-medium text-green-700">운행인증 완료된 예약만 리뷰를 작성할 수 있습니다.</span>
      </div>

      {/* Reservation Selector */}
      <div className="mb-6">
        <Select
          label="예약 선택"
          options={reservationOptions}
          value={selectedReservation}
          onChange={(e) => setSelectedReservation(e.target.value)}
          placeholder="예약을 선택하세요"
        />
      </div>

      {/* Target Type Tabs */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">리뷰 대상</label>
        <div className="flex gap-2">
          <button
            onClick={() => setTarget('driver')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors border ${
              target === 'driver'
                ? 'bg-[#1B6FF4] text-white border-[#1B6FF4]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            기사 리뷰
          </button>
          <button
            onClick={() => setTarget('pension')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors border ${
              target === 'pension'
                ? 'bg-[#1B6FF4] text-white border-[#1B6FF4]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            펜션 리뷰
          </button>
        </div>
      </div>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">별점</label>
        <div className="flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} size="lg" />
          <span className="text-lg font-bold text-gray-900">
            {rating > 0 ? `${rating}점` : ''}
          </span>
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-6">
        <Textarea
          label="리뷰 내용"
          placeholder={
            target === 'driver'
              ? '기사님의 운전 실력, 친절도, 차량 상태 등을 작성해주세요.'
              : '펜션의 시설, 청결도, 서비스 등을 작성해주세요.'
          }
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={6}
        />
      </div>

      {/* Photo Upload Placeholder */}
      <div className="mb-8">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">사진 첨부</label>
        <div className="flex gap-2">
          <button
            onClick={() => showToast('사진 업로드 기능은 준비 중입니다.')}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#1B6FF4] hover:text-[#1B6FF4] transition-colors"
          >
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs">추가</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">최대 5장까지 첨부 가능</p>
      </div>

      {/* Submit */}
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={handleSubmit}
      >
        리뷰 등록하기
      </Button>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
