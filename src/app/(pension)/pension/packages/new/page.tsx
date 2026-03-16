'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  Bus,
  Calculator,
  FileText,
  Upload,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

const steps = [
  { label: '숙박설정', icon: Home },
  { label: '버스설정', icon: Bus },
  { label: '가격설정', icon: Calculator },
  { label: '상세정보', icon: FileText },
];

const pensionOptions = [
  { value: '', label: '펜션을 선택하세요' },
  { value: 'pension-001', label: '가평 힐링 펜션' },
  { value: 'pension-002', label: '속초 바다 펜션' },
];

const roomOptions = [
  { value: '', label: '객실 구성을 선택하세요' },
  { value: 'all', label: '전체 대관 (8실)' },
  { value: 'half', label: '반 대관 (4실)' },
  { value: 'custom', label: '객실 수 직접 입력' },
];

const mealOptions = [
  { value: 'none', label: '식사 미포함' },
  { value: 'bbq', label: '바베큐 포함' },
  { value: 'breakfast', label: '조식 포함' },
  { value: 'full', label: '바베큐 + 조식 포함' },
];

const departureRegionOptions = [
  { value: '', label: '출발 지역을 선택하세요' },
  { value: '서울', label: '서울' },
  { value: '경기 북부', label: '경기 북부' },
  { value: '경기 남부', label: '경기 남부' },
  { value: '인천', label: '인천' },
];

const vehicleTypeOptions = [
  { value: '', label: '차량을 선택하세요' },
  { value: '25인승 미니버스', label: '25인승 미니버스' },
  { value: '28인승 중형버스', label: '28인승 중형버스' },
  { value: '45인승 대형버스', label: '45인승 대형버스' },
];

const tripTypeOptions = [
  { value: 'round', label: '왕복' },
  { value: 'oneway', label: '편도' },
];

export default function NewPackagePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Accommodation
  const [selectedPension, setSelectedPension] = useState('');
  const [roomConfig, setRoomConfig] = useState('');
  const [checkIn, setCheckIn] = useState('15:00');
  const [checkOut, setCheckOut] = useState('11:00');
  const [meal, setMeal] = useState('none');

  // Step 2: Bus
  const [departureRegion, setDepartureRegion] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [tripType, setTripType] = useState('round');

  // Step 3: Pricing
  const [pensionCost, setPensionCost] = useState('1200000');
  const [busCost, setBusCost] = useState('800000');
  const [margin, setMargin] = useState('200000');
  const [minPassengers, setMinPassengers] = useState('20');
  const [maxPassengers, setMaxPassengers] = useState('45');

  // Step 4: Details
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [includes, setIncludes] = useState('왕복 버스, 숙박 1박, 바베큐');
  const [excludes, setExcludes] = useState('개인 경비, 추가 식사');

  const totalCost = Number(pensionCost || 0) + Number(busCost || 0) + Number(margin || 0);
  const pricePerPerson = Number(maxPassengers) > 0 ? Math.ceil(totalCost / Number(maxPassengers)) : 0;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    alert('패키지가 등록되었습니다. (데모)');
    router.push('/pension/packages');
  };

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">새 패키지 만들기</h1>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    index <= currentStep
                      ? 'bg-[#1B6FF4] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 ${
                    index <= currentStep ? 'text-[#1B6FF4] font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 mx-2 mt-[-16px] ${
                    index < currentStep ? 'bg-[#1B6FF4]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Step 1: Accommodation */}
        {currentStep === 0 && (
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">숙박 설정</h2>
              <div className="space-y-4">
                <Select
                  label="펜션 선택"
                  options={pensionOptions}
                  value={selectedPension}
                  onChange={(e) => setSelectedPension(e.target.value)}
                />
                <Select
                  label="객실 구성"
                  options={roomOptions}
                  value={roomConfig}
                  onChange={(e) => setRoomConfig(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="체크인 시간"
                    type="time"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                  <Input
                    label="체크아웃 시간"
                    type="time"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
                <Select
                  label="식사 옵션"
                  options={mealOptions}
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Bus */}
        {currentStep === 1 && (
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">버스 설정</h2>
              <div className="space-y-4">
                <Select
                  label="출발 지역"
                  options={departureRegionOptions}
                  value={departureRegion}
                  onChange={(e) => setDepartureRegion(e.target.value)}
                />
                <Select
                  label="차량 종류"
                  options={vehicleTypeOptions}
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
                <Select
                  label="운행 유형"
                  options={tripTypeOptions}
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Pricing */}
        {currentStep === 2 && (
          <Card>
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">가격 설정</h2>
              <div className="space-y-4">
                <Input
                  label="펜션 비용 (원)"
                  type="number"
                  value={pensionCost}
                  onChange={(e) => setPensionCost(e.target.value)}
                  placeholder="숙박 + 식사 비용"
                />
                <Input
                  label="버스 비용 (원)"
                  type="number"
                  value={busCost}
                  onChange={(e) => setBusCost(e.target.value)}
                  placeholder="왕복 버스 비용"
                />
                <Input
                  label="마진 (원)"
                  type="number"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  placeholder="수익"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">펜션 비용</span>
                      <span className="text-gray-900">{Number(pensionCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">버스 비용</span>
                      <span className="text-gray-900">{Number(busCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">마진</span>
                      <span className="text-gray-900">{Number(margin || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-200 font-semibold">
                      <span className="text-[#1B6FF4]">총 비용</span>
                      <span className="text-[#1B6FF4]">{totalCost.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-[#1B6FF4]">1인당 가격 (최대인원 기준)</span>
                      <span className="text-[#1B6FF4]">{pricePerPerson.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="최소 인원"
                    type="number"
                    value={minPassengers}
                    onChange={(e) => setMinPassengers(e.target.value)}
                  />
                  <Input
                    label="최대 인원"
                    type="number"
                    value={maxPassengers}
                    onChange={(e) => setMaxPassengers(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">상세 정보</h2>
                <div className="space-y-4">
                  <Input
                    label="패키지 이름"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="예: 가평 힐링 1박2일 패키지"
                  />
                  <Textarea
                    label="패키지 설명"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="패키지에 대한 상세 설명을 입력하세요"
                  />

                  {/* Photo Upload */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      패키지 사진
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1B6FF4] transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">클릭하여 사진을 업로드하세요</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG (최대 10MB)</p>
                    </div>
                  </div>

                  <Textarea
                    label="포함 사항"
                    value={includes}
                    onChange={(e) => setIncludes(e.target.value)}
                    placeholder="쉼표로 구분하여 입력"
                  />
                  <Textarea
                    label="불포함 사항"
                    value={excludes}
                    onChange={(e) => setExcludes(e.target.value)}
                    placeholder="쉼표로 구분하여 입력"
                  />
                </div>
              </div>
            </Card>

            {/* Preview */}
            <Card>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">미리보기</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {packageName || '패키지 이름'}
                  </h3>
                  <p className="text-sm text-gray-600">{description || '패키지 설명'}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>차량: {vehicleType || '-'}</span>
                    <span>출발: {departureRegion || '-'}</span>
                    <span>인원: {minPassengers}~{maxPassengers}명</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-2xl font-bold text-[#1B6FF4]">
                      {pricePerPerson.toLocaleString()}원
                    </span>
                    <span className="text-sm text-gray-500"> / 1인</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pb-8">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            이전
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button variant="primary" onClick={handleNext}>
              다음
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              <Check className="w-4 h-4" />
              패키지 등록하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
