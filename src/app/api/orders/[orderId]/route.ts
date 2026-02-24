import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
    params: Promise<{ orderId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { orderId } = await params;

        if (!orderId) {
            return NextResponse.json({ error: '주문 ID가 필요합니다.' }, { status: 400 });
        }

        // orders 조회
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
        }

        // fortunes 조회
        const { data: fortune } = await supabase
            .from('fortunes')
            .select('*')
            .eq('order_id', orderId)
            .single();

        return NextResponse.json({
            order,
            fortune: fortune || null,
        });
    } catch (err) {
        console.error('GET /api/orders/[orderId] error:', err);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
