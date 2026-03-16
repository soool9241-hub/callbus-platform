import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '버스고 - 전국 1등 버스대절 최저가 비교';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1B6FF4 0%, #0B4FCC 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <span style={{ fontSize: '64px' }}>🚌</span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            버스고
          </span>
          <div
            style={{
              background: '#FF6B35',
              color: 'white',
              fontSize: '24px',
              fontWeight: 800,
              padding: '8px 16px',
              borderRadius: '50px',
            }}
          >
            +펜션
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '52px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.3,
            marginBottom: '32px',
          }}
        >
          전국 1등 버스대절 최저가 비교
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          타사대비 25% 저렴 · 3분만에 최대 20개 견적 · 평점 4.9
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
          }}
        >
          {[
            { value: '25%', label: '저렴' },
            { value: '3분', label: '견적도착' },
            { value: '4.9', label: '평균평점' },
            { value: '24h', label: '무료취소' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '20px 36px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#FFD700',
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: '18px',
                  color: 'rgba(255,255,255,0.8)',
                  marginTop: '4px',
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
