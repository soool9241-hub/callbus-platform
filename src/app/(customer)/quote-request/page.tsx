'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { VEHICLE_TYPES, PURPOSES } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { createQuoteRequest } from '@/lib/supabase-db';
import toast from 'react-hot-toast';
import {
  MapPin,
  Calendar,
  Users,
  Phone,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
} from 'lucide-react';

const TOTAL_STEPS = 4;

const stepLabels = ['노선 정보', '일정 정보', '상세 정보', '연락처'];

export default function QuoteRequestPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { currentUser } = useStore();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Route
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [waypoints, setWaypoints] = useState<string[]>([]);

  // Step 2: Schedule
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'one_way' | 'round'>('round');

  // Step 3: Details
  const [passengerCount, setPassengerCount] = useState('');
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [purpose, setPurpose] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 4: Contact
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const addWaypoint = () => setWaypoints([...waypoints, '']);
  const removeWaypoint = (idx: number) => setWaypoints(waypoints.filter((_, i) => i !== idx));
  const updateWaypoint = (idx: number, val: string) => {
    const updated = [...waypoints];
    updated[idx] = val;
    setWaypoints(updated);
  };

  const toggleVehicleType = (key: string) => {
    setSelectedVehicleTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn || !currentUser) {
      toast.error('로그인 후 이용 가능합니다');
      router.push('/auth');
      return;
    }

    // Validation
    if (!departure || !destination) {
      toast.error('출발지와 도착지를 입력해주세요.');
      return;
    }
    if (!departureDate) {
      toast.error('출발 일시를 입력해주세요.');
      return;
    }
    if (!passengerCount || Number(passengerCount) <= 0) {
      toast.error('인원수를 입력해주세요.');
      return;
    }
    if (selectedVehicleTypes.length === 0) {
      toast.error('차량 타입을 선택해주세요.');
      return;
    }
    if (!contactPhone) {
      toast.error('연락처를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const requestNumber = `BUS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      const { error } = await createQuoteRequest({
        customer_id: currentUser.id,
        request_number: requestNumber,
        departure_address: departure,
        destination_address: destination,
        waypoints: waypoints.filter(Boolean).map((wp, i) => ({
          address: wp,
          lat: 0,
          lng: 0,
          order: i + 1,
        })),
        departure_datetime: new Date(departureDate).toISOString(),
        return_datetime: tripType === 'round' && returnDate ? new Date(returnDate).toISOString() : undefined,
        trip_type: tripType,
        passenger_count: Number(passengerCount),
        vehicle_type: selectedVehicleTypes,
        purpose,
        special_requests: specialRequests || undefined,
        contact_phone: contactPhone,
      });

      if (error) throw error;

      toast.success('견적 요청이 등록되었습니다!');
      setSubmitted(true);
    } catch (err: any) {
      console.error('견적 요청 실패:', err);
      toast.error(err?.message || '견적 요청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">견적 요청 완료!</h2>
        <p className="text-gray-600 mb-8">
          기사님들의 견적을 기다려주세요.
          <br />
          보통 1~2시간 내에 견적이 도착합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => { setSubmitted(false); setStep(1); }}>
            새 견적 신청
          </Button>
          <Button onClick={() => window.location.href = '/quotes'}>
            내 견적 확인
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">견적 신청</h1>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${
                  i + 1 <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[10px] sm:text-xs mt-1 ${i + 1 <= step ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <Card padding="lg">
        {/* Step 1: Route */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              노선 정보
            </h2>
            <Input
              label="출발지"
              placeholder="출발 장소를 입력하세요"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              prefixIcon={<MapPin className="w-4 h-4" />}
            />
            <Input
              label="도착지"
              placeholder="도착 장소를 입력하세요"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              prefixIcon={<MapPin className="w-4 h-4" />}
            />

            {waypoints.map((wp, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label={`경유지 ${i + 1}`}
                    placeholder="경유 장소를 입력하세요"
                    value={wp}
                    onChange={(e) => updateWaypoint(i, e.target.value)}
                    prefixIcon={<MapPin className="w-4 h-4" />}
                  />
                </div>
                <button
                  onClick={() => removeWaypoint(i)}
                  className="mb-0.5 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={addWaypoint}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              경유지 추가
            </button>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              일정 정보
            </h2>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="round"
                  checked={tripType === 'round'}
                  onChange={() => setTripType('round')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">왕복</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="one_way"
                  checked={tripType === 'one_way'}
                  onChange={() => setTripType('one_way')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">편도</span>
              </label>
            </div>

            <Input
              label="출발 일시"
              type="datetime-local"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />

            {tripType === 'round' && (
              <Input
                label="귀환 일시"
                type="datetime-local"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            )}
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              상세 정보
            </h2>

            <Input
              label="인원수"
              type="number"
              placeholder="탑승 인원을 입력하세요"
              value={passengerCount}
              onChange={(e) => setPassengerCount(e.target.value)}
              prefixIcon={<Users className="w-4 h-4" />}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                차량 타입 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLE_TYPES.map((vt) => (
                  <label
                    key={vt.key}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedVehicleTypes.includes(vt.key)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVehicleTypes.includes(vt.key)}
                      onChange={() => toggleVehicleType(vt.key)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium">{vt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Select
              label="이용 목적"
              placeholder="이용 목적을 선택하세요"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              options={PURPOSES.map((p) => ({ value: p, label: p }))}
            />

            <Textarea
              label="요청사항"
              placeholder="기사님께 전달할 요청사항을 입력하세요 (선택)"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              연락처
            </h2>
            <Input
              label="이름"
              placeholder="이름을 입력하세요"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
            <Input
              label="전화번호"
              placeholder="010-0000-0000"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              prefixIcon={<Phone className="w-4 h-4" />}
            />
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              입력하신 전화번호로 견적 도착 알림을 보내드립니다.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={step === 1}
            className="min-h-[48px]"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </Button>

          {step < TOTAL_STEPS ? (
            <Button onClick={handleNext} size="lg" className="min-h-[48px]">
              다음
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} size="lg" className="min-h-[48px]">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  처리중...
                </>
              ) : (
                <>
                  견적 신청하기
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>

    </div>
  );
}
