import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: "버스고 | 전국 1등 버스대절 최저가 비교",
  description: "타사대비 25% 저렴! 3분만에 최대 20개 견적 비교. 전세버스, 관광버스, 통근버스 대절부터 펜션+버스 패키지까지. 전담매니저 배정, 24시간 무료취소, 안심 예약 보장.",
  keywords: "전세버스, 버스대절, 관광버스, 통근버스, 대형버스, 가격비교, 버스고, 펜션패키지, 전세버스가격, 버스대절가격",
  authors: [{ name: "버스고" }],
  creator: "버스고",
  publisher: "버스고",
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
  metadataBase: new URL("https://callbus-app.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://callbus-app.vercel.app",
    siteName: "버스고",
    title: "버스고 | 전국 1등 버스대절 최저가 비교",
    description: "타사대비 25% 저렴! 3분만에 최대 20개 견적 비교. 전세버스·관광버스 대절부터 펜션+버스 패키지까지.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "버스고 - 전국 1등 버스대절 최저가 비교 플랫폼",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "버스고 | 전국 1등 버스대절 최저가 비교",
    description: "타사대비 25% 저렴! 3분만에 최대 20개 견적 비교. 전세버스·관광버스 대절부터 펜션+버스 패키지까지.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
  other: {
    "naver-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        {/* 카카오톡 미리보기용 추가 메타태그 */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="theme-color" content="#1B6FF4" />
      </head>
      <body
        className="font-[Pretendard] antialiased text-sm md:text-base"
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { background: '#363636', color: '#fff', borderRadius: '12px', padding: '12px 20px' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' }, duration: 4000 },
          }}
        />
      </body>
    </html>
  );
}
