import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPaymentProvider } from '@/lib/payment';
import { generateFortuneLetter, generatePromptHash } from '@/lib/openai';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, externalOrderId, paymentKey } = body;

        if (!orderId || !externalOrderId) {
            return NextResponse.json({ error: '필수 파라미터가 없습니다.' }, { status: 400 });
        }

        // 1. 주문 조회
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
        }

        // 2. 결제 확인 (이미 처리된 경우 fortune만 생성)
        if (order.status === 'fortune_generated') {
            return NextResponse.json({ orderId }, { status: 200 });
        }

        // 3. 결제 컨펌
        if (order.status === 'pending_payment') {
            const provider = getPaymentProvider();
            const confirmResult = await provider.confirmPayment(externalOrderId, paymentKey);

            if (!confirmResult.success) {
                await supabase
                    .from('payments')
                    .update({ status: 'failed' })
                    .eq('external_order_id', externalOrderId);

                return NextResponse.json({ error: '결제 확인에 실패했습니다.' }, { status: 400 });
            }

            // 결제 성공 업데이트
            await supabase
                .from('payments')
                .update({
                    status: 'success',
                    provider_payment_id: confirmResult.paymentId ?? null,
                    paid_at: new Date().toISOString(),
                })
                .eq('external_order_id', externalOrderId);

            await supabase
                .from('orders')
                .update({ status: 'paid' })
                .eq('id', orderId);
        }

        // 4. 운세 생성 (paid 상태일 때만)
        const { data: existingFortune } = await supabase
            .from('fortunes')
            .select('id')
            .eq('order_id', orderId)
            .single();

        if (!existingFortune) {
            try {
                const fortuneContent = await generateFortuneLetter({
                    name: order.name,
                    birthDate: order.birth_date,
                    story: order.story,
                });

                const promptHash = generatePromptHash({
                    name: order.name,
                    birthDate: order.birth_date,
                    story: order.story,
                });

                await supabase.from('fortunes').insert({
                    order_id: orderId,
                    content: fortuneContent,
                    model: 'gpt-4o-mini',
                    prompt_hash: promptHash,
                });

                await supabase
                    .from('orders')
                    .update({ status: 'fortune_generated' })
                    .eq('id', orderId);
            } catch (aiError) {
                console.error('OpenAI generation failed:', aiError);
                await supabase
                    .from('orders')
                    .update({ status: 'failed' })
                    .eq('id', orderId);
                // 결제는 보존, 재시도 가능
                return NextResponse.json(
                    { error: '운세 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ orderId });
    } catch (err) {
        console.error('POST /api/payments/confirm error:', err);
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
