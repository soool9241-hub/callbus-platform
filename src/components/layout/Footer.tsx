'use client';

export default function Footer() {
  const handleFooterLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert('준비 중입니다');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-2">콜버스</h3>
            <p className="text-gray-400 text-sm">
              콜버스 - 대형버스 중계 플랫폼
            </p>
            <p className="text-gray-400 text-sm mt-1">
              간편하게 버스를 예약하고, 안전하게 이동하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase mb-3">약관 및 정책</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" onClick={handleFooterLink} className="text-gray-400 hover:text-white text-sm transition-colors">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" onClick={handleFooterLink} className="text-gray-400 hover:text-white text-sm transition-colors">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="#" onClick={handleFooterLink} className="text-gray-400 hover:text-white text-sm transition-colors">
                  사업자정보
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase mb-3">고객센터</h4>
            <p className="text-2xl font-bold text-white">1588-0000</p>
            <p className="text-gray-400 text-sm mt-1">
              평일 09:00 ~ 18:00 (주말/공휴일 휴무)
            </p>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2026 콜버스. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
