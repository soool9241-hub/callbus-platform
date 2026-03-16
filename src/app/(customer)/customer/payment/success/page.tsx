'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import PaymentResult from '@/components/payment/PaymentResult';
import { confirmPayment } from '@/lib/payments';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    orderDetails?: {
      orderId: string;
      orderName: string;
      amount: number;
      method?: string;
      approvedAt?: string;
    };
    errorCode?: string;
    errorMessage?: string;
  } | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setResult({
        success: false,
        errorCode: 'INVALID_PARAMS',
        errorMessage: '결제 정보가 올바르지 않습니다.',
      });
      setLoading(false);
      return;
    }

    async function confirm() {
      try {
        const response = await confirmPayment({
          paymentKey: paymentKey!,
          orderId: orderId!,
          amount: Number(amount),
        });

        if (response.success && response.data) {
          setResult({
            success: true,
            orderDetails: {
              orderId: response.data.orderId,
              orderName: `버스고 예약 결제`,
              amount: response.data.totalAmount,
              method: response.data.method,
              approvedAt: response.data.approvedAt,
            },
          });
        } else {
          setResult({
            success: false,
            errorCode: response.error?.code,
            errorMessage: response.error?.message,
          });
        }
      } catch {
        setResult({
          success: false,
          errorCode: 'NETWORK_ERROR',
          errorMessage: '결제 승인 요청 중 오류가 발생했습니다.',
        });
      } finally {
        setLoading(false);
      }
    }

    confirm();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500">결제를 확인하고 있습니다...</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <PaymentResult
      status={result.success ? 'success' : 'fail'}
      orderDetails={result.orderDetails}
      errorCode={result.errorCode}
      errorMessage={result.errorMessage}
    />
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><Spinner size="lg" /><p className="text-sm text-gray-500">결제를 확인하고 있습니다...</p></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
