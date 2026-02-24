import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPaymentProvider } from '@/lib/payment';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: '주문 ID가 필요합니다.' }, { status: 400 });
        }

        // 주문 확인
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
        }

        if (order.status !== 'pending_payment') {
            return NextResponse.json({ error: '이미 처리된 주문입니다.' }, { status: 400 });
        }

        const provider = getPaymentProvider();
        const result = await provider.requestPayment({
            orderId,
            amount: order.amount,
            orderName: '술사의 편지 — FortuneOne',
            customerName: order.name,
        });

        // payments 레코드 생성
        const { error: paymentError } = await supabase.from('payments').insert({
            order_id: orderId,
            provider: result.provider,
            external_order_id: result.externalOrderId,
            amount: order.amount,
            status: 'pending',
        });

        if (paymentError) {
            console.error('Payment insert error:', paymentError);
            return NextResponse.json({ error: '결제 초기화에 실패했습니다.' }, { status: 500 });
        }

        return NextResponse.json({
            externalOrderId: result.externalOrderId,
            provider: result.provider,
            amount: order.amount,
        });
    } catch (err) {
        console.error('POST /api/payments/request error:', err);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
