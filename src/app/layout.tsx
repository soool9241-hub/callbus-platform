import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: "버스고 | 버스대절 최저가 비교 + 펜션 패키지",
  description: "전세버스 대절 가격비교부터 펜션+버스 패키지까지. 전국 기사님 견적 비교, 24시간 무료취소, 안심 예약 보장.",
  keywords: "전세버스, 대형버스, 관광버스, 통근버스, 버스대절, 가격비교",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
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
