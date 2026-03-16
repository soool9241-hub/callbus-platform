'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Bus, Clock, Navigation, MapPin } from 'lucide-react';
import KakaoMap from './KakaoMap';
import type {
  DriverLocationTrackerProps,
  MapMarker,
  PolylinePath,
  LatLng,
  DriverLocation,
} from '@/types/map';

/** 두 좌표 사이의 직선 거리 (km) - Haversine 공식 */
function haversineDistance(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const calc =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(calc), Math.sqrt(1 - calc));
}

/** 두 좌표 사이를 보간 */
function interpolate(a: LatLng, b: LatLng, t: number): LatLng {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

/** 두 좌표 사이의 방위각 (degrees) */
function bearing(a: LatLng, b: LatLng): number {
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * 기사 실시간 위치 추적 컴포넌트
 *
 * - 버스 아이콘 마커가 경로를 따라 이동
 * - ETA 표시
 * - 경로 진행률 표시
 * - 데모용 시뮬레이션 이동
 */
export default function DriverLocationTracker({
  departure,
  arrival,
  stops = [],
  className = '',
}: DriverLocationTrackerProps) {
  // 경로 전체 포인트 (출발 -> 경유지 -> 도착)
  const routePoints = useMemo<LatLng[]>(() => {
    return [
      { lat: departure.lat, lng: departure.lng },
      ...stops.map((s) => ({ lat: s.lat, lng: s.lng })),
      { lat: arrival.lat, lng: arrival.lng },
    ];
  }, [departure, arrival, stops]);

  // 전체 경로 거리 (km)
  const totalDistance = useMemo(() => {
    let d = 0;
    for (let i = 1; i < routePoints.length; i++) {
      d += haversineDistance(routePoints[i - 1], routePoints[i]);
    }
    return d;
  }, [routePoints]);

  const [progress, setProgress] = useState(0); // 0 ~ 1
  const [driverPos, setDriverPos] = useState<DriverLocation>({
    lat: departure.lat,
    lng: departure.lng,
    heading: 0,
    speed: 0,
    timestamp: new Date().toISOString(),
  });

  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 시뮬레이션: 3초마다 진행률 증가
  useEffect(() => {
    animationRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          if (animationRef.current) clearInterval(animationRef.current);
          return 1;
        }
        return Math.min(prev + 0.02, 1);
      });
    }, 3000);

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  // 진행률에 따라 기사 위치 계산
  useEffect(() => {
    if (routePoints.length < 2) return;

    // 경로에서 현재 위치 계산
    const targetDistance = progress * totalDistance;
    let accumulated = 0;

    for (let i = 1; i < routePoints.length; i++) {
      const segDist = haversineDistance(routePoints[i - 1], routePoints[i]);
      if (accumulated + segDist >= targetDistance) {
        const t = segDist > 0 ? (targetDistance - accumulated) / segDist : 0;
        const pos = interpolate(routePoints[i - 1], routePoints[i], t);
        const head = bearing(routePoints[i - 1], routePoints[i]);
        const speed = 40 + Math.random() * 30; // 40~70 km/h

        setDriverPos({
          lat: pos.lat,
          lng: pos.lng,
          heading: Math.round(head),
          speed: Math.round(speed),
          timestamp: new Date().toISOString(),
        });
        return;
      }
      accumulated += segDist;
    }

    // 끝에 도달
    const last = routePoints[routePoints.length - 1];
    setDriverPos((prev) => ({
      ...prev,
      lat: last.lat,
      lng: last.lng,
      speed: 0,
      timestamp: new Date().toISOString(),
    }));
  }, [progress, routePoints, totalDistance]);

  // 남은 거리 / ETA 계산
  const remainingDistance = totalDistance * (1 - progress);
  const avgSpeed = 50; // 평균 50km/h 가정
  const etaMinutes = Math.round((remainingDistance / avgSpeed) * 60);
  const etaDisplay =
    etaMinutes >= 60
      ? `약 ${Math.floor(etaMinutes / 60)}시간 ${etaMinutes % 60}분`
      : `약 ${etaMinutes}분`;

  // 마커 데이터
  const markers = useMemo<MapMarker[]>(() => {
    const result: MapMarker[] = [
      {
        id: 'departure',
        lat: departure.lat,
        lng: departure.lng,
        label: `출발: ${departure.address}`,
        type: 'departure',
      },
      {
        id: 'arrival',
        lat: arrival.lat,
        lng: arrival.lng,
        label: `도착: ${arrival.address}`,
        type: 'arrival',
      },
      {
        id: 'driver',
        lat: driverPos.lat,
        lng: driverPos.lng,
        label: '기사님 현재 위치',
        type: 'driver',
      },
    ];

    stops.forEach((stop, i) => {
      result.push({
        id: `stop-${i}`,
        lat: stop.lat,
        lng: stop.lng,
        label: `경유지 ${i + 1}: ${stop.address}`,
        type: 'stop',
      });
    });

    return result;
  }, [departure, arrival, stops, driverPos.lat, driverPos.lng]);

  // 폴리라인
  const polyline = useMemo<PolylinePath>(() => ({
    path: routePoints,
    strokeColor: '#1B6FF4',
    strokeWeight: 4,
    strokeOpacity: 0.8,
  }), [routePoints]);

  // 지도 중심 (기사 위치)
  const center = useMemo<LatLng>(
    () => ({ lat: driverPos.lat, lng: driverPos.lng }),
    [driverPos.lat, driverPos.lng]
  );

  // 방향 텍스트
  const headingText = (deg: number): string => {
    const dirs = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
    const index = Math.round(deg / 45) % 8;
    return dirs[index];
  };

  return (
    <div className={className}>
      {/* 지도 */}
      <KakaoMap
        center={center}
        zoom={6}
        markers={markers}
        polyline={polyline}
        height="360px"
        className="mb-4"
      />

      {/* 진행 상태 바 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>출발지</span>
          <span>{Math.round(progress * 100)}% 진행</span>
          <span>도착지</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B6FF4] rounded-full transition-all duration-1000 ease-linear relative"
            style={{ width: `${progress * 100}%` }}
          >
            {/* 버스 아이콘 위치 표시 */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-[#10B981] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              <Bus className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="grid grid-cols-2 gap-3">
        {/* ETA */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#1B6FF4]" />
            <span className="text-xs text-[#1B6FF4] font-medium">도착 예정</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {progress >= 1 ? '도착 완료' : etaDisplay}
          </p>
        </div>

        {/* 남은 거리 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">남은 거리</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {progress >= 1 ? '0 km' : `${remainingDistance.toFixed(1)} km`}
          </p>
        </div>

        {/* 현재 속도 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1.5 mb-1">
            <Navigation className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-medium">현재 속도</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {progress >= 1 ? '0' : driverPos.speed} km/h
          </p>
        </div>

        {/* 방향 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1.5 mb-1">
            <Navigation
              className="w-3.5 h-3.5 text-gray-500"
              style={{ transform: `rotate(${driverPos.heading}deg)` }}
            />
            <span className="text-xs text-gray-500 font-medium">진행 방향</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {headingText(driverPos.heading)} ({driverPos.heading}°)
          </p>
        </div>
      </div>
    </div>
  );
}
