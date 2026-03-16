'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PaymentResult from '@/components/payment/PaymentResult';
import { Spinner } from '@/components/ui/Spinner';

function PaymentFailContent() {
  const searchParams = useSearchParams();

  const errorCode = searchParams.get('code') || '알 수 없음';
  const errorMessage = searchParams.get('message') || '결제 처리 중 문제가 발생했습니다.';
  const orderId = searchParams.get('orderId');

  return (
    <PaymentResult
      status="fail"
      errorCode={errorCode}
      errorMessage={decodeURIComponent(errorMessage)}
      orderDetails={
        orderId
          ? {
              orderId,
              orderName: '버스고 예약 결제',
              amount: 0,
            }
          : undefined
      }
    />
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>}>
      <PaymentFailContent />
    </Suspense>
  );
}
