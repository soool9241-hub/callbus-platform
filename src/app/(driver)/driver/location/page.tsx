'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Clock, Info, Wifi, WifiOff, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import KakaoMap from '@/components/map/KakaoMap';
import type { MapMarker, LatLng } from '@/types/map';

/** 서울 지역 목업 좌표 */
const MOCK_ROUTE: LatLng[] = [
  { lat: 37.5665, lng: 126.978 },   // 서울시청
  { lat: 37.5547, lng: 126.9707 },  // 서울역
  { lat: 37.5326, lng: 126.9906 },  // 용산
  { lat: 37.5172, lng: 127.0473 },  // 강남
  { lat: 37.5133, lng: 127.1001 },  // 잠실
];

export default function LocationPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<LatLng>({
    lat: 37.5665,
    lng: 126.978,
  });
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(0);
  const [routeIndex, setRouteIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 세그먼트 내 보간 값 0~1
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // 시뮬레이션: 운행 중일 때 경로를 따라 이동
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.1;
        if (next >= 1) {
          // 다음 세그먼트로 이동
          setRouteIndex((ri) => {
            const nextIdx = ri + 1;
            if (nextIdx >= MOCK_ROUTE.length - 1) {
              // 경로 끝 -> 처음으로 반복
              return 0;
            }
            return nextIdx;
          });
          return 0;
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isTracking]);

  // 좌표 보간
  useEffect(() => {
    if (!isTracking) return;

    const from = MOCK_ROUTE[routeIndex];
    const to = MOCK_ROUTE[Math.min(routeIndex + 1, MOCK_ROUTE.length - 1)];

    const lat = from.lat + (to.lat - from.lat) * progress;
    const lng = from.lng + (to.lng - from.lng) * progress;

    // 방향 계산
    const dLng = ((to.lng - from.lng) * Math.PI) / 180;
    const lat1 = (from.lat * Math.PI) / 180;
    const lat2 = (to.lat * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const deg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

    setCurrentPosition({ lat, lng });
    setHeading(Math.round(deg));
    setSpeed(40 + Math.round(Math.random() * 30));
    setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
  }, [isTracking, routeIndex, progress]);

  const handleToggleTracking = useCallback(() => {
    if (isTracking) {
      // 운행 종료
      setSpeed(0);
      setRouteIndex(0);
      setProgress(0);
    }
    setIsTracking((prev) => !prev);
  }, [isTracking]);

  // 방향 텍스트
  const headingText = (deg: number): string => {
    const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
    return dirs[Math.round(deg / 45) % 8];
  };

  // 마커
  const markers: MapMarker[] = [
    {
      id: 'driver',
      lat: currentPosition.lat,
      lng: currentPosition.lng,
      label: '내 현재 위치',
      type: 'driver',
    },
  ];

  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">실시간 위치</h1>

      {/* 상태 배지 */}
      <div className="flex items-center gap-3 mb-4">
        <Badge variant={isTracking ? 'success' : 'default'} size="md" dot>
          {isTracking ? '위치 공유 중' : '공유 중지'}
        </Badge>
        {isTracking && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Wifi className="w-3.5 h-3.5 text-[#10B981]" />
            <span>10초 간격 전송 중</span>
          </div>
        )}
        {!isTracking && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <WifiOff className="w-3.5 h-3.5" />
            <span>전송 중지</span>
          </div>
        )}
      </div>

      {/* 지도 */}
      <Card className="mb-4" padding="none">
        <KakaoMap
          center={currentPosition}
          zoom={4}
          markers={markers}
          polyline={
            isTracking
              ? {
                  path: MOCK_ROUTE,
                  strokeColor: '#1B6FF4',
                  strokeWeight: 3,
                  strokeOpacity: 0.5,
                }
              : undefined
          }
          height="320px"
          className="rounded-t-xl"
        />

        <div className="p-4 space-y-4">
          {/* GPS 좌표 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Navigation className="w-4 h-4 text-[#1B6FF4]" />
            <span>
              위도: {currentPosition.lat.toFixed(6)} / 경도: {currentPosition.lng.toFixed(6)}
            </span>
          </div>

          {/* 속도 / 방향 */}
          {isTracking && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Gauge className="w-4 h-4 text-[#1B6FF4] mx-auto mb-1" />
                <p className="text-xs text-gray-500">속도</p>
                <p className="text-sm font-bold text-gray-900">{speed} km/h</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Navigation
                  className="w-4 h-4 text-[#1B6FF4] mx-auto mb-1"
                  style={{ transform: `rotate(${heading}deg)` }}
                />
                <p className="text-xs text-gray-500">방향</p>
                <p className="text-sm font-bold text-gray-900">
                  {headingText(heading)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Clock className="w-4 h-4 text-[#1B6FF4] mx-auto mb-1" />
                <p className="text-xs text-gray-500">마지막 전송</p>
                <p className="text-sm font-bold text-gray-900">
                  {lastUpdate || '-'}
                </p>
              </div>
            </div>
          )}

          {/* 토글 버튼 */}
          <Button
            fullWidth
            size="lg"
            className={
              isTracking
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                : 'bg-[#1B6FF4] hover:bg-[#0B4FCC] active:bg-[#0940A8]'
            }
            onClick={handleToggleTracking}
          >
            {isTracking ? (
              <>
                <WifiOff className="w-5 h-5" />
                운행 종료
              </>
            ) : (
              <>
                <Wifi className="w-5 h-5" />
                운행 시작
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 안내 카드 */}
      <Card>
        <div className="p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#1B6FF4] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">위치 전송 안내</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>운행 시작 시 10초 간격으로 위치가 자동 전송됩니다.</li>
              <li>위치 정보는 고객에게 실시간으로 공유됩니다.</li>
              <li>운행 종료 후 전송이 중단됩니다.</li>
              <li>GPS 정확도를 위해 실외에서 사용해 주세요.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
