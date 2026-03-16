import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "콜버스 - 전세버스 대절 가격비교 플랫폼",
  description: "한 번의 신청으로 여러 버스 기사의 견적을 비교하고 최저가로 예약하세요. 전세버스, 관광버스, 통근버스 대절 서비스.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-sm md:text-base`}
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
