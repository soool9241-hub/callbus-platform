'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, AlertTriangle, Receipt } from 'lucide-react';
import { formatPrice } from '@/lib/payments';

// ── 타입 ──────────────────────────────────────────────────

interface OrderDetails {
  orderId: string;
  orderName: string;
  amount: number;
  method?: string;
  approvedAt?: string;
}

interface PaymentResultProps {
  status: 'success' | 'fail';
  orderDetails?: OrderDetails;
  errorCode?: string;
  errorMessage?: string;
}

// ── 컴포넌트 ────────────────────────────────────────────────

export default function PaymentResult({
  status,
  orderDetails,
  errorCode,
  errorMessage,
}: PaymentResultProps) {
  const router = useRouter();

  return (
    <div className="py-8 px-4 sm:px-6 max-w-lg mx-auto flex flex-col items-center">
      {/* 상태 아이콘 */}
      {status === 'success' ? (
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center animate-[scaleIn_0.5s_ease-out]">
            <CheckCircle2 className="w-12 h-12 text-[#10B981] animate-[checkmark_0.6s_ease-out_0.2s_both]" />
          </div>
          {/* 파티클 효과 */}
          <div className="absolute inset-0 -m-2">
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#10B981] rounded-full animate-[particle1_1s_ease-out_0.3s_both]" />
            <div className="absolute top-1/4 right-0 w-1 h-1 bg-[#10B981]/60 rounded-full animate-[particle2_1s_ease-out_0.4s_both]" />
            <div className="absolute bottom-1/4 left-0 w-1.5 h-1.5 bg-[#10B981]/40 rounded-full animate-[particle3_1s_ease-out_0.5s_both]" />
          </div>
        </div>
      ) : (
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
      )}

      {/* 상태 메시지 */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {status === 'success' ? '결제가 완료되었습니다' : '결제에 실패했습니다'}
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        {status === 'success'
          ? '예약이 정상적으로 확정되었습니다. 감사합니다.'
          : '결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.'}
      </p>

      {/* 주문 상세 (성공 시) */}
      {status === 'success' && orderDetails && (
        <Card padding="md" className="w-full mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-4 h-4 text-gray-400" />
            <h3 className="font-bold text-gray-900 text-sm">주문 상세</h3>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="font-mono text-gray-900 text-xs">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">주문명</span>
              <span className="text-gray-900 text-right max-w-[200px]">
                {orderDetails.orderName}
              </span>
            </div>
            {orderDetails.method && (
              <div className="flex justify-between">
                <span className="text-gray-500">결제 수단</span>
                <span className="text-gray-900">{orderDetails.method}</span>
              </div>
            )}
            {orderDetails.approvedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">결제 일시</span>
                <span className="text-gray-900">
                  {new Date(orderDetails.approvedAt).toLocaleString('ko-KR')}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-base">
              <span>결제 금액</span>
              <span className="text-[#FF6B35]">{formatPrice(orderDetails.amount)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* 오류 정보 (실패 시) */}
      {status === 'fail' && (errorCode || errorMessage) && (
        <Card padding="md" className="w-full mb-6 border-red-200 bg-red-50/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              {errorCode && (
                <p className="text-red-600 font-medium mb-1">오류 코드: {errorCode}</p>
              )}
              <p className="text-red-700">
                {errorMessage || '알 수 없는 오류가 발생했습니다.'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 버튼 */}
      <div className="w-full space-y-3">
        {status === 'success' ? (
          <>
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => router.push('/customer/reservations')}
            >
              예약 확인하기
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="lg"
              onClick={() => router.push('/')}
            >
              홈으로
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => router.push('/customer/payment')}
            >
              다시 결제하기
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="lg"
              onClick={() => router.push('/')}
            >
              홈으로
            </Button>
          </>
        )}
      </div>

      {/* CSS 애니메이션 */}
      <style jsx>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes particle1 {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-10px, -20px) scale(1);
            opacity: 0;
          }
        }
        @keyframes particle2 {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(15px, -10px) scale(1);
            opacity: 0;
          }
        }
        @keyframes particle3 {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-15px, 10px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
