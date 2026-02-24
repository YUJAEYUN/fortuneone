'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';

function LoadingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const externalOrderId = searchParams.get('externalOrderId');
    const hasCalled = useRef(false);
    const [dots, setDots] = useState('');
    const [error, setError] = useState('');

    // Animated dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Confirm payment and generate fortune
    useEffect(() => {
        if (!orderId || !externalOrderId || hasCalled.current) return;
        hasCalled.current = true;

        const confirm = async () => {
            try {
                const res = await fetch('/api/payments/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId, externalOrderId }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || '운세 생성에 실패했습니다.');
                    return;
                }

                router.push(`/result/${data.orderId}`);
            } catch {
                setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
            }
        };

        confirm();
    }, [orderId, externalOrderId, router]);

    if (!orderId) {
        router.push('/');
        return null;
    }

    return (
        <main style={{
            minHeight: '100svh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Loading background image */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <Image
                    src="/assets/loading-bg.png"
                    alt="별자리 배경"
                    fill
                    priority
                    style={{ objectFit: 'cover', opacity: 0.2 }}
                    className="animate-spin-slow"
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(13,13,26,0.3) 0%, rgba(13,13,26,0.9) 100%)'
                }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '380px' }}>
                {error ? (
                    /* Error state */
                    <div className="animate-fade-in">
                        <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚠️</div>
                        <h2 style={{ fontSize: '20px', color: 'var(--cream)', marginBottom: '12px' }}>
                            잠시 문제가 생겼습니다
                        </h2>
                        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.7 }}>
                            {error}
                        </p>
                        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                            결제는 정상 처리되었습니다.<br />
                            아래 주문 번호로 재시도해주세요.
                        </p>
                        <p style={{ color: 'var(--gold)', fontSize: '12px', marginTop: '8px', wordBreak: 'break-all' }}>
                            {orderId}
                        </p>
                    </div>
                ) : (
                    /* Loading state */
                    <div>
                        {/* Symbol image */}
                        <div
                            className="animate-float"
                            style={{ width: '120px', height: '120px', margin: '0 auto 32px', position: 'relative' }}
                        >
                            <Image
                                src="/assets/symbol.png"
                                alt="술사의 눈"
                                width={120}
                                height={120}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>

                        <h2
                            className="animate-fade-in"
                            style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: 'var(--cream)',
                                marginBottom: '12px',
                                lineHeight: 1.5,
                            }}
                        >
                            술사가 당신의 기운을<br />읽고 있습니다{dots}
                        </h2>

                        <p
                            className="animate-fade-in delay-200"
                            style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '40px', lineHeight: 1.8 }}
                        >
                            별빛 사이에서 당신만의 편지를 쓰고 있습니다<br />
                            잠시만 기다려주세요
                        </p>

                        {/* Progress bar */}
                        <div style={{
                            width: '200px',
                            height: '2px',
                            background: 'var(--border)',
                            borderRadius: '100px',
                            margin: '0 auto',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--lavender), var(--gold))',
                                borderRadius: '100px',
                                animation: 'shimmer 2s linear infinite',
                                backgroundSize: '200% auto',
                            }} />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function LoadingPage() {
    return (
        <Suspense fallback={
            <main style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--muted)' }}>로딩 중...</div>
            </main>
        }>
            <LoadingContent />
        </Suspense>
    );
}
