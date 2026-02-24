import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, birth_date, story } = body;

        // 유효성 검증
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ error: '이름을 입력해주세요.' }, { status: 400 });
        }
        if (!birth_date || !/^\d{4}-\d{2}-\d{2}$/.test(birth_date)) {
            return NextResponse.json({ error: '생년월일을 올바르게 입력해주세요.' }, { status: 400 });
        }
        if (story && story.length > 200) {
            return NextResponse.json({ error: '사연은 200자 이내로 입력해주세요.' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('orders')
            .insert({
                name: name.trim(),
                birth_date,
                story: story?.trim() || null,
                status: 'pending_payment',
                amount: 1000,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Order creation error:', error);
            return NextResponse.json({ error: '주문 생성에 실패했습니다.' }, { status: 500 });
        }

        return NextResponse.json({ orderId: data.id }, { status: 201 });
    } catch (err) {
        console.error('POST /api/orders error:', err);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
