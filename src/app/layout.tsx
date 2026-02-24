import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FortuneOne — 면접·시험 전날 밤, 나만을 위한 술사의 편지',
  description: '불확실한 내일을 앞두고 마음이 떨리는 당신에게, 술사가 편지를 씁니다. 1,000원으로 나만의 운세를 확인하세요.',
  keywords: ['면접 운세', '취업 운세', '수능 운세', '운세', 'FortuneOne'],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'FortuneOne — 나만을 위한 술사의 편지',
    description: '면접·시험 전날 밤, 별빛이 담긴 운세 편지를 받아보세요.',
    type: 'website',
  },
};

// Stars background component
function StarsBackground() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 4,
  }));

  return (
    <div className="stars-container" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            '--duration': `${star.duration}s`,
            '--delay': `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StarsBackground />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
