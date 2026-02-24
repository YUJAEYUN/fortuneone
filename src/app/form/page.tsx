'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
    name: string;
    birth_date: string;
    story: string;
}

interface FormErrors {
    name?: string;
    birth_date?: string;
    story?: string;
}

export default function FormPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        birth_date: '',
        story: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const storyRef = useRef<HTMLTextAreaElement>(null);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = '이름 또는 닉네임을 입력해주세요.';
        }

        if (!formData.birth_date) {
            newErrors.birth_date = '생년월일을 입력해주세요.';
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birth_date)) {
            newErrors.birth_date = '올바른 날짜 형식으로 입력해주세요. (YYYY-MM-DD)';
        }

        if (formData.story.length > 200) {
            newErrors.story = '사연은 200자 이내로 입력해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setServerError('');

        try {
            // 1. 주문 생성
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) {
                setServerError(orderData.error || '주문 생성에 실패했습니다.');
                return;
            }

            const { orderId } = orderData;

            // 2. 결제 요청
            const payRes = await fetch('/api/payments/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
            });

            const payData = await payRes.json();
            if (!payRes.ok) {
                setServerError(payData.error || '결제 초기화에 실패했습니다.');
                return;
            }

            // 3. 로딩 페이지로 이동 (orderId + externalOrderId 전달)
            router.push(
                `/loading?orderId=${orderId}&externalOrderId=${payData.externalOrderId}`
            );
        } catch {
            setServerError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        background: 'rgba(42, 42, 74, 0.5)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        color: 'var(--cream)',
        fontFamily: 'var(--font-serif)',
        fontSize: '16px',
        padding: '14px 16px',
        width: '100%',
        outline: 'none',
        minHeight: '48px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '13px',
        color: 'var(--gold)',
        marginBottom: '8px',
        letterSpacing: '0.05em',
    };

    const errorStyle: React.CSSProperties = {
        color: '#F87171',
        fontSize: '13px',
        marginTop: '6px',
    };

    return (
        <main style={{ minHeight: '100svh', padding: '24px 20px 40px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', flex: 1 }}>

                {/* Header */}
                <div style={{ marginBottom: '32px', paddingTop: '16px' }}>
                    <Link
                        href="/"
                        style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
                    >
                        ← 돌아가기
                    </Link>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--gold)', fontSize: '28px', marginBottom: '8px' }}>✦</div>
                        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--cream)', marginBottom: '8px' }}>
                            당신의 기운을 알려주세요
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
                            술사가 편지를 쓰기 위해 필요한 정보입니다
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* 이름 */}
                        <div>
                            <label htmlFor="name" style={labelStyle}>
                                이름 또는 닉네임 <span style={{ color: '#F87171' }}>*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="예: 김민준"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.name ? '#F87171' : 'var(--border)',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'; }}
                                onBlur={(e) => { e.target.style.borderColor = errors.name ? '#F87171' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                            />
                            {errors.name && <p style={errorStyle}>{errors.name}</p>}
                        </div>

                        {/* 생년월일 */}
                        <div>
                            <label htmlFor="birth_date" style={labelStyle}>
                                생년월일 <span style={{ color: '#F87171' }}>*</span>
                            </label>
                            <input
                                id="birth_date"
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.birth_date ? '#F87171' : 'var(--border)',
                                    colorScheme: 'dark',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'; }}
                                onBlur={(e) => { e.target.style.borderColor = errors.birth_date ? '#F87171' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                            />
                            {errors.birth_date && <p style={errorStyle}>{errors.birth_date}</p>}
                        </div>

                        {/* 사연 */}
                        <div>
                            <label htmlFor="story" style={labelStyle}>
                                사연 <span style={{ color: 'var(--muted)' }}>(선택 · 최대 200자)</span>
                            </label>
                            <textarea
                                id="story"
                                ref={storyRef}
                                placeholder="예: 내일 네이버 면접이야. 최근에 자신이 없어서 걱정돼..."
                                value={formData.story}
                                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                rows={4}
                                maxLength={200}
                                style={{
                                    ...inputStyle,
                                    minHeight: '120px',
                                    resize: 'vertical',
                                    borderColor: errors.story ? '#F87171' : 'var(--border)',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'; }}
                                onBlur={(e) => { e.target.style.borderColor = errors.story ? '#F87171' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                {errors.story && <p style={errorStyle}>{errors.story}</p>}
                                <p style={{ color: formData.story.length > 180 ? '#F87171' : 'var(--muted)', fontSize: '12px', marginLeft: 'auto' }}>
                                    {formData.story.length} / 200
                                </p>
                            </div>
                        </div>

                        {/* 서버 에러 */}
                        {serverError && (
                            <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '12px', padding: '14px 16px', color: '#F87171', fontSize: '14px' }}>
                                {serverError}
                            </div>
                        )}

                        {/* 제출 버튼 */}
                        <button
                            id="submit-payment"
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-fortune"
                            style={{ width: '100%', marginTop: '8px' }}
                        >
                            {isSubmitting ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(13,13,26,0.3)', borderTopColor: '#0D0D1A', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
                                    결제 처리 중...
                                </span>
                            ) : (
                                '1,000원 결제하기 →'
                            )}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)' }}>
                            결제 후 술사가 즉시 편지를 씁니다 ·  안전 결제 (SSL)
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}
