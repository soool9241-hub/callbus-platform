import { NextRequest, NextResponse } from 'next/server';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_sk_placeholder_secret_key';
const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments/confirm';

interface ConfirmRequestBody {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmRequestBody = await request.json();

    const { paymentKey, orderId, amount } = body;

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: '필수 파라미터가 누락되었습니다. (paymentKey, orderId, amount)',
          },
        },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_AMOUNT',
            message: '결제 금액이 올바르지 않습니다.',
          },
        },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
    const encodedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');

    const tossResponse = await fetch(TOSS_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: tossData.code || 'PAYMENT_CONFIRM_FAILED',
            message: tossData.message || '결제 승인에 실패했습니다.',
          },
        },
        { status: tossResponse.status }
      );
    }

    // TODO: 결제 성공 후 DB에 결제 정보 저장
    // await supabase.from('payments').insert({ ... });

    return NextResponse.json({
      success: true,
      data: {
        paymentKey: tossData.paymentKey,
        orderId: tossData.orderId,
        status: tossData.status,
        totalAmount: tossData.totalAmount,
        method: tossData.method,
        approvedAt: tossData.approvedAt,
        receipt: tossData.receipt,
      },
    });
  } catch (error: any) {
    console.error('결제 승인 오류:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 내부 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
