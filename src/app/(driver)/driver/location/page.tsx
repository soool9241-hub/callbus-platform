'use client';

import { useState } from 'react';
import { MapPin, Navigation, Clock, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function LocationPage() {
  const [isTracking, setIsTracking] = useState(false);

  const mockCoords = { lat: 37.5665, lng: 126.978 };

  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">실시간 위치</h1>

      {/* Map Placeholder */}
      <Card className="mb-6" padding="none">
        <div className="h-80 bg-gray-100 rounded-t-xl flex flex-col items-center justify-center text-gray-400">
          <MapPin className="w-16 h-16 mb-3 text-gray-300" />
          <p className="text-lg font-medium">카카오맵 연동 예정</p>
          <p className="text-sm mt-1">지도가 이 영역에 표시됩니다</p>
        </div>
        <div className="p-5">
          {/* GPS Coordinates */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Navigation className="w-4 h-4 text-[#1B6FF4]" />
            <span>위도: {mockCoords.lat} / 경도: {mockCoords.lng}</span>
          </div>

          {/* Current Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">현재 상태:</span>
              <Badge variant={isTracking ? 'success' : 'default'} size="sm" dot>
                {isTracking ? '운행 중' : '대기 중'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">ETA:</span>
              <span className="text-sm font-medium text-gray-900">
                {isTracking ? '약 1시간 30분' : '-'}
              </span>
            </div>
          </div>

          {/* Toggle Button */}
          <Button
            fullWidth
            size="lg"
            className={
              isTracking
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                : 'bg-[#1B6FF4] hover:bg-[#0B4FCC] active:bg-[#0940A8]'
            }
            onClick={() => setIsTracking(!isTracking)}
          >
            <Clock className="w-5 h-5" />
            {isTracking ? '운행 종료' : '운행 시작'}
          </Button>
        </div>
      </Card>

      {/* Info Card */}
      <Card>
        <div className="p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#1B6FF4] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">위치 전송 안내</p>
            <p className="text-sm text-gray-500">
              운행 시작 시 10초 간격으로 위치가 자동 전송됩니다. 위치 정보는 고객에게 실시간으로 공유되며, 운행 종료 후 전송이 중단됩니다.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
