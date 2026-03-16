// ============================================================
// 콜버스 플랫폼 - 유틸리티 함수
// ============================================================

import { VEHICLE_TYPES, RESERVATION_STATUSES } from '@/types';

/**
 * 가격을 한국 원화 형식으로 포맷팅
 * @example formatPrice(1234000) => "1,234,000원"
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

/**
 * ISO 날짜 문자열을 한국어 날짜로 포맷팅
 * @example formatDate("2026-03-20T10:00:00") => "2026년 3월 20일"
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/**
 * ISO 날짜 문자열을 한국어 날짜+시간으로 포맷팅
 * @example formatDateTime("2026-03-20T10:00:00") => "2026년 3월 20일 오전 10:00"
 */
export function formatDateTime(date: string): string {
  const d = new Date(date);
  const hour = d.getHours();
  const minute = d.getMinutes().toString().padStart(2, '0');
  const ampm = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${ampm} ${displayHour}:${minute}`;
}

/**
 * 차량 타입 키에 대한 한국어 라벨 반환
 * @example getVehicleTypeLabel("bus_45") => "45인승 대형버스"
 */
export function getVehicleTypeLabel(type: string): string {
  const found = VEHICLE_TYPES.find((v) => v.key === type);
  return found ? found.label : type;
}

/**
 * 상태 값에 대한 한국어 라벨 반환 (예약 상태 + 기타 상태)
 */
export function getStatusLabel(status: string): string {
  // 예약 상태
  const reservationStatus = RESERVATION_STATUSES.find((s) => s.key === status);
  if (reservationStatus) return reservationStatus.label;

  // 견적 요청 상태
  const requestStatusMap: Record<string, string> = {
    open: '견적 모집 중',
    in_progress: '진행 중',
    reserved: '예약 완료',
    completed: '완료',
    cancelled: '취소됨',
    expired: '마감됨',
  };
  if (requestStatusMap[status]) return requestStatusMap[status];

  // 견적 상태
  const quoteStatusMap: Record<string, string> = {
    submitted: '제출됨',
    selected: '선택됨',
    rejected: '미선택',
  };
  if (quoteStatusMap[status]) return quoteStatusMap[status];

  // 결제 상태
  const paymentStatusMap: Record<string, string> = {
    pending: '대기',
    completed: '완료',
    failed: '실패',
    refunded: '환불',
  };
  if (paymentStatusMap[status]) return paymentStatusMap[status];

  return status;
}

/**
 * 상태 값에 대한 Tailwind CSS 색상 클래스 반환
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    // 견적 요청 상태
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    reserved: 'bg-purple-100 text-purple-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-500',

    // 예약 상태
    pending_payment: 'bg-yellow-100 text-yellow-800',
    deposit_paid: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',

    // 견적 상태
    submitted: 'bg-blue-100 text-blue-800',
    selected: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',

    // 결제 상태
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
  };

  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * 견적 요청 번호 생성
 * @example "BUS-2026-A3F8K2"
 */
export function generateRequestNumber(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BUS-${year}-${code}`;
}

/**
 * 총 금액과 예약금 비율로 예약금 / 잔금 계산
 * @param totalPrice 총 금액
 * @param rate 예약금 비율 (기본 30%)
 */
export function calculateDeposit(
  totalPrice: number,
  rate: number = 0.3
): { deposit: number; remaining: number } {
  const deposit = Math.round(totalPrice * rate);
  const remaining = totalPrice - deposit;
  return { deposit, remaining };
}

/**
 * 상대 시간 표시 (한국어)
 * @example getRelativeTime("2026-03-16T12:00:00") => "3분 전"
 */
export function getRelativeTime(date: string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();

  // 미래 시간 처리
  if (diffMs < 0) {
    const absDiff = Math.abs(diffMs);
    const minutes = Math.floor(absDiff / 60000);
    const hours = Math.floor(absDiff / 3600000);
    const days = Math.floor(absDiff / 86400000);

    if (minutes < 1) return '곧';
    if (minutes < 60) return `${minutes}분 후`;
    if (hours < 24) return `${hours}시간 후`;
    if (days < 30) return `${days}일 후`;
    return formatDate(date);
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  if (months < 12) return `${months}개월 전`;
  return `${years}년 전`;
}
