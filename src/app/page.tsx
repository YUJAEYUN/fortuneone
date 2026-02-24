import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main
      style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
    >
      {/* Hero Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/assets/hero.png"
          alt="신비로운 밤하늘"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.35 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,13,26,0.5) 0%, rgba(13,13,26,0.7) 50%, rgba(13,13,26,0.95) 100%)'
        }} />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          textAlign: 'center',
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Badge */}
        <div
          className="animate-fade-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '100px',
            border: '1px solid rgba(201,168,76,0.4)',
            background: 'rgba(201,168,76,0.08)',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: 'var(--gold)', fontSize: '14px' }}>✦</span>
          <span style={{ color: 'var(--gold)', fontSize: '13px', fontFamily: 'var(--font-garamond)', letterSpacing: '0.08em' }}>
            FortuneOne
          </span>
        </div>

        {/* Main Title */}
        <h1
          className="animate-fade-in-up delay-100"
          style={{
            fontSize: 'clamp(26px, 7vw, 38px)',
            fontWeight: 700,
            lineHeight: 1.4,
            marginBottom: '16px',
            color: 'var(--cream)',
            wordBreak: 'keep-all',
          }}
        >
          내일의 면접, <br />
          <span className="text-gold-gradient">오늘 밤 기운을 살펴드립니다</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up delay-200"
          style={{
            fontSize: '16px',
            color: 'var(--muted)',
            lineHeight: 1.8,
            marginBottom: '48px',
            maxWidth: '320px',
            wordBreak: 'keep-all',
          }}
        >
          불확실한 내일을 앞두고 마음이 떨리는 당신에게,<br />
          술사가 편지를 씁니다
        </p>

        {/* CTA Button */}
        <Link
          href="/form"
          className="animate-fade-in-up delay-300 animate-pulse-gold"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '18px 36px',
            background: 'linear-gradient(135deg, var(--gold) 0%, #B8943E 100%)',
            color: '#0D0D1A',
            borderRadius: '14px',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: '16px',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            marginBottom: '32px',
          }}
          id="cta-button"
        >
          기운 살펴보기
          <span style={{ fontSize: '18px' }}>→</span>
        </Link>

        {/* Price Badge */}
        <div
          className="animate-fade-in delay-500"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--muted)',
            fontSize: '14px',
          }}
        >
          <span style={{ color: 'var(--lavender)', fontSize: '16px' }}>✦</span>
          <span>1,000원 · 일회성 단건 구매</span>
          <span style={{ color: 'var(--lavender)', fontSize: '16px' }}>✦</span>
        </div>
      </div>

      {/* Bottom Feature List */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '20px 20px 40px',
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          className="letter-card animate-fade-in delay-700"
          style={{ padding: '20px 24px' }}
        >
          {[
            { icon: '✦', text: '생년월일과 사연으로 맞춤 편지 생성' },
            { icon: '✦', text: 'PDF로 저장해 언제든 다시 보기' },
            { icon: '✦', text: '1,000원 단건 결제 — 구독 없음' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 0',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span style={{ color: 'var(--gold)', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ color: 'var(--cream)', fontSize: '14px' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
