'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FortuneContent } from '@/types';

interface ResultData {
    order: {
        id: string;
        name: string;
        birth_date: string;
        story?: string;
        status: string;
    };
    fortune: {
        id: string;
        content: FortuneContent;
        created_at: string;
    } | null;
}

function Section({
    icon,
    title,
    content,
    delay,
}: {
    icon: string;
    title: string;
    content: string;
    delay: number;
}) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
                marginBottom: '32px',
            }}
        >
            <div className="letter-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '18px' }}>{icon}</span>
                    <h2 style={{ fontSize: '15px', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.05em' }}>
                        {title}
                    </h2>
                </div>
                <p style={{
                    color: 'var(--cream)',
                    fontSize: '15px',
                    lineHeight: 2.0,
                    whiteSpace: 'pre-line',
                    fontFamily: 'var(--font-serif)',
                }}>
                    {content}
                </p>
            </div>
        </div>
    );
}

export default function ResultPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    const [data, setData] = useState<ResultData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const letterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!orderId) return;

        const fetchResult = async () => {
            try {
                const res = await fetch(`/api/orders/${orderId}`);
                const json = await res.json();

                if (!res.ok) {
                    setError(json.error || '결과를 불러올 수 없습니다.');
                    return;
                }

                if (json.order.status === 'pending_payment' || json.order.status === 'paid') {
                    // Still generating
                    setTimeout(fetchResult, 2000);
                    return;
                }

                setData(json);
            } catch {
                setError('네트워크 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResult();
    }, [orderId]);

    const handlePdfDownload = async () => {
        if (!letterRef.current || !data) return;
        setIsPdfLoading(true);

        try {
            const html2canvas = (await import('html2canvas')).default;
            const jsPDF = (await import('jspdf')).jsPDF;

            const canvas = await html2canvas(letterRef.current, {
                backgroundColor: '#0D0D1A',
                scale: 2,
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`FortuneOne_${data.order.name}_편지.pdf`);
        } catch (err) {
            console.error('PDF export error:', err);
            alert('PDF 저장 중 오류가 발생했습니다.');
        } finally {
            setIsPdfLoading(false);
        }
    };

    if (isLoading) {
        return (
            <main style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--gold)', fontSize: '32px', marginBottom: '16px' }}>✦</div>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>편지를 불러오는 중...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
                <div style={{ textAlign: 'center', maxWidth: '320px' }}>
                    <p style={{ color: '#F87171', marginBottom: '16px' }}>{error}</p>
                    <Link href="/" className="btn-fortune" style={{ display: 'inline-block' }}>
                        처음으로 돌아가기
                    </Link>
                </div>
            </main>
        );
    }

    if (!data?.fortune) {
        return (
            <main style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
                <div style={{ textAlign: 'center', maxWidth: '320px' }}>
                    <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>
                        운세를 찾을 수 없습니다.<br />결제가 완료되지 않았을 수 있습니다.
                    </p>
                    <button onClick={() => router.push('/form')} className="btn-fortune">
                        다시 시도하기
                    </button>
                </div>
            </main>
        );
    }

    const { order, fortune } = data;

    return (
        <main style={{ padding: '24px 20px 60px' }}>
            <div style={{ maxWidth: '560px', margin: '0 auto', width: '100%' }}>

                {/* Header */}
                <div
                    style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '16px', opacity: 0, animation: 'fadeInUp 0.8s ease 0.1s forwards' }}
                >
                    {/* Envelope image */}
                    <div
                        className="animate-float"
                        style={{ width: '100px', height: '100px', margin: '0 auto 20px', position: 'relative' }}
                    >
                        <Image
                            src="/assets/envelope.png"
                            alt="술사의 편지봉투"
                            width={100}
                            height={100}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '8px', fontFamily: 'var(--font-garamond)', fontStyle: 'italic', letterSpacing: '0.1em' }}>
                        FortuneOne
                    </p>

                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--cream)', marginBottom: '6px' }}>
                        <span className="text-gold-gradient">{order.name}</span>에게
                    </h1>

                    <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.8 }}>
                        오늘 당신의 기운을 살펴보았습니다.
                    </p>
                </div>

                {/* Letter Container */}
                <div ref={letterRef} style={{ padding: '8px' }}>

                    {/* Divider */}
                    <div style={{ textAlign: 'center', marginBottom: '32px', opacity: 0, animation: 'fadeIn 1s ease 0.4s forwards' }}>
                        <Image
                            src="/assets/divider.png"
                            alt="별 장식 구분선"
                            width={280}
                            height={60}
                            style={{ objectFit: 'contain', maxWidth: '100%' }}
                        />
                    </div>

                    {/* Section 1: 전체 기운 */}
                    <Section
                        icon="✦"
                        title="오늘의 전체 기운"
                        content={fortune.content.overall_energy}
                        delay={600}
                    />

                    {/* Divider */}
                    <div style={{ textAlign: 'center', marginBottom: '32px', opacity: 0, animation: 'fadeIn 1s ease 1s forwards' }}>
                        <Image
                            src="/assets/divider.png"
                            alt="별 장식 구분선"
                            width={200}
                            height={45}
                            style={{ objectFit: 'contain', maxWidth: '100%', opacity: 0.6 }}
                        />
                    </div>

                    {/* Section 2: 면접 기운 */}
                    <Section
                        icon="✦"
                        title="면접(시험)의 기운"
                        content={fortune.content.interview_energy}
                        delay={1200}
                    />

                    {/* Divider */}
                    <div style={{ textAlign: 'center', marginBottom: '32px', opacity: 0, animation: 'fadeIn 1s ease 1.6s forwards' }}>
                        <Image
                            src="/assets/divider.png"
                            alt="별 장식 구분선"
                            width={200}
                            height={45}
                            style={{ objectFit: 'contain', maxWidth: '100%', opacity: 0.6 }}
                        />
                    </div>

                    {/* Section 3: 마지막 말 */}
                    <Section
                        icon="✦"
                        title="술사의 마지막 말"
                        content={fortune.content.closing_message}
                        delay={1800}
                    />

                    {/* Signature */}
                    <div
                        style={{
                            textAlign: 'right',
                            padding: '16px 8px',
                            opacity: 0,
                            animation: 'fadeIn 1s ease 2.4s forwards',
                        }}
                    >
                        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.8 }}>
                            별빛이 당신과 함께하기를,
                        </p>
                        <p style={{ color: 'var(--gold)', fontSize: '16px', fontFamily: 'var(--font-garamond)', fontStyle: 'italic' }}>
                            술사 드림
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '40px',
                        flexDirection: 'column',
                        opacity: 0,
                        animation: 'fadeInUp 0.8s ease 2.8s forwards',
                    }}
                >
                    <button
                        id="pdf-download"
                        onClick={handlePdfDownload}
                        disabled={isPdfLoading}
                        className="btn-fortune"
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        {isPdfLoading ? '저장 중...' : '📄 PDF로 저장하기'}
                    </button>

                    <Link
                        href="/"
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            color: 'var(--muted)',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                        }}
                    >
                        처음으로 돌아가기
                    </Link>
                </div>

                {/* URL share hint */}
                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '24px', lineHeight: 1.7 }}>
                    이 페이지 URL을 북마크하면 나중에 다시 볼 수 있어요
                </p>
            </div>
        </main>
    );
}
