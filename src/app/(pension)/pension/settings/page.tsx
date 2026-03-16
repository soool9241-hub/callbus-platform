'use client';

import { useState } from 'react';
import {
  Building2,
  CreditCard,
  Bell,
  Phone,
  Save,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const bankOptions = [
  { value: '', label: '은행을 선택하세요' },
  { value: '국민은행', label: '국민은행' },
  { value: '신한은행', label: '신한은행' },
  { value: '하나은행', label: '하나은행' },
  { value: '우리은행', label: '우리은행' },
  { value: '농협은행', label: '농협은행' },
  { value: '기업은행', label: '기업은행' },
  { value: '카카오뱅크', label: '카카오뱅크' },
  { value: '토스뱅크', label: '토스뱅크' },
];

export default function SettingsPage() {
  const [toast, setToast] = useState('');

  // Business profile
  const [businessName, setBusinessName] = useState('가평힐링펜션');
  const [businessNumber, setBusinessNumber] = useState('123-45-67890');
  const [representative, setRepresentative] = useState('홍길동');

  // Bank info
  const [bankName, setBankName] = useState('국민은행');
  const [accountNumber, setAccountNumber] = useState('123456-78-901234');
  const [accountHolder, setAccountHolder] = useState('홍길동');

  // Notification settings
  const [notifyNewBooking, setNotifyNewBooking] = useState(true);
  const [notifyNewReview, setNotifyNewReview] = useState(true);
  const [notifyQuoteResponse, setNotifyQuoteResponse] = useState(true);
  const [notifySettlement, setNotifySettlement] = useState(true);
  const [notifyChat, setNotifyChat] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);

  // Contact info
  const [contactPhone, setContactPhone] = useState('010-1234-5678');
  const [contactEmail, setContactEmail] = useState('pension@example.com');

  const handleSave = () => {
    setToast('설정이 저장되었습니다.');
    setTimeout(() => setToast(''), 2000);
  };

  const toggleSwitch = (value: boolean, setter: (v: boolean) => void) => (
    <button
      onClick={() => setter(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-[#1B6FF4]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <Button variant="primary" onClick={handleSave}>
          <Save className="w-4 h-4" />
          저장
        </Button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Business Profile */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1B6FF4]" />
              사업자 정보
            </h2>
            <div className="space-y-4">
              <Input
                label="상호명"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="상호명을 입력하세요"
              />
              <Input
                label="사업자 등록번호"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
                placeholder="000-00-00000"
              />
              <Input
                label="대표자명"
                value={representative}
                onChange={(e) => setRepresentative(e.target.value)}
                placeholder="대표자명을 입력하세요"
              />
            </div>
          </div>
        </Card>

        {/* Bank Info */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#1B6FF4]" />
              정산 계좌 정보
            </h2>
            <div className="space-y-4">
              <Select
                label="은행"
                options={bankOptions}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <Input
                label="계좌번호"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="계좌번호를 입력하세요"
              />
              <Input
                label="예금주"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="예금주명을 입력하세요"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#1B6FF4]" />
              알림 설정
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">새 예약 알림</p>
                  <p className="text-xs text-gray-500">새로운 예약이 들어오면 알림을 받습니다</p>
                </div>
                {toggleSwitch(notifyNewBooking, setNotifyNewBooking)}
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">리뷰 알림</p>
                  <p className="text-xs text-gray-500">새로운 리뷰가 작성되면 알림을 받습니다</p>
                </div>
                {toggleSwitch(notifyNewReview, setNotifyNewReview)}
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">견적 응답 알림</p>
                  <p className="text-xs text-gray-500">견적 응답이 도착하면 알림을 받습니다</p>
                </div>
                {toggleSwitch(notifyQuoteResponse, setNotifyQuoteResponse)}
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">정산 알림</p>
                  <p className="text-xs text-gray-500">정산 처리 시 알림을 받습니다</p>
                </div>
                {toggleSwitch(notifySettlement, setNotifySettlement)}
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">채팅 알림</p>
                  <p className="text-xs text-gray-500">새로운 메시지가 도착하면 알림을 받습니다</p>
                </div>
                {toggleSwitch(notifyChat, setNotifyChat)}
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">마케팅 알림</p>
                  <p className="text-xs text-gray-500">프로모션 및 이벤트 알림을 받습니다</p>
                </div>
                {toggleSwitch(notifyMarketing, setNotifyMarketing)}
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#1B6FF4]" />
              연락처 정보
            </h2>
            <div className="space-y-4">
              <Input
                label="전화번호"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="010-0000-0000"
              />
              <Input
                label="이메일"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </Card>

        {/* Bottom Save */}
        <div className="pb-8">
          <Button variant="primary" fullWidth size="lg" onClick={handleSave}>
            <Save className="w-4 h-4" />
            설정 저장
          </Button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
