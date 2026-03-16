/**
 * 토스페이먼츠 SDK 연동 유틸리티
 */

// ── 타입 정의 ──────────────────────────────────────────────

export type PaymentMethodType = 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'EASY_PAY';

export interface OrderInfo {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerMobilePhone?: string;
}

export interface PaymentRequestParams extends OrderInfo {
  method: PaymentMethodType;
  successUrl: string;
  failUrl: string;
}

export interface PaymentConfirmParams {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentConfirmResponse {
  success: boolean;
  data?: {
    paymentKey: string;
    orderId: string;
    status: string;
    totalAmount: number;
    method: string;
    approvedAt: string;
    receipt?: { url: string };
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface PriceBreakdown {
  basePrice: number;
  discount: number;
  platformFee: number;
  total: number;
}

// ── 결제 금액 포맷 유틸 ─────────────────────────────────────

/** 숫자를 한국 원화 형식으로 포맷 (예: 614,000원) */
export function formatPrice(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

/** 숫자를 한국 원화 형식으로 포맷 (기호 포함, 예: ₩614,000) */
export function formatPriceWithSymbol(amount: number): string {
  return '₩' + amount.toLocaleString('ko-KR');
}

/** 가격 분해 계산 */
export function calculatePriceBreakdown(
  basePrice: number,
  discountAmount: number = 0,
  platformFeeRate: number = 0.03
): PriceBreakdown {
  const afterDiscount = basePrice - discountAmount;
  const platformFee = Math.round(afterDiscount * platformFeeRate);
  const total = afterDiscount + platformFee;

  return {
    basePrice,
    discount: discountAmount,
    platformFee,
    total,
  };
}

// ── 주문 ID 생성 ────────────────────────────────────────────

/** 고유 주문 ID 생성 (토스 형식: 영문 대소문자, 숫자, 하이픈, 언더바 허용, 6~64자) */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BUSGO-${timestamp}-${random}`;
}

// ── 토스페이먼츠 SDK ────────────────────────────────────────

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_placeholder_key';

/** TossPayments SDK 로드 (브라우저 전용) */
async function loadTossPaymentsSDK(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('토스페이먼츠 SDK는 브라우저 환경에서만 사용할 수 있습니다.');
  }

  // 이미 로드된 경우 재사용
  if ((window as any).TossPayments) {
    return (window as any).TossPayments;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.onload = () => {
      if ((window as any).TossPayments) {
        resolve((window as any).TossPayments);
      } else {
        reject(new Error('토스페이먼츠 SDK 로드에 실패했습니다.'));
      }
    };
    script.onerror = () => reject(new Error('토스페이먼츠 SDK 스크립트 로드에 실패했습니다.'));
    document.head.appendChild(script);
  });
}

/** 토스페이먼츠 클라이언트 초기화 */
export async function initTossPayments() {
  const TossPayments = await loadTossPaymentsSDK();
  return TossPayments(TOSS_CLIENT_KEY);
}

/** 결제 메서드 매핑 */
const METHOD_MAP: Record<PaymentMethodType, string> = {
  CARD: '카드',
  VIRTUAL_ACCOUNT: '가상계좌',
  TRANSFER: '계좌이체',
  EASY_PAY: '간편결제',
};

/** 결제 요청 */
export async function requestPayment(params: PaymentRequestParams): Promise<void> {
  const tossPayments = await initTossPayments();

  const paymentParams: Record<string, any> = {
    amount: params.amount,
    orderId: params.orderId,
    orderName: params.orderName,
    customerName: params.customerName,
    successUrl: params.successUrl,
    failUrl: params.failUrl,
  };

  if (params.customerEmail) {
    paymentParams.customerEmail = params.customerEmail;
  }
  if (params.customerMobilePhone) {
    paymentParams.customerMobilePhone = params.customerMobilePhone;
  }

  // 가상계좌 추가 옵션
  if (params.method === 'VIRTUAL_ACCOUNT') {
    paymentParams.validHours = 24;
    paymentParams.cashReceipt = { type: '소득공제' };
  }

  await tossPayments.requestPayment(METHOD_MAP[params.method], paymentParams);
}

/** 서버 측 결제 승인 요청 */
export async function confirmPayment(
  params: PaymentConfirmParams
): Promise<PaymentConfirmResponse> {
  const response = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  return data;
}
