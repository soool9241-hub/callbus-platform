'use client';

import React, { useMemo } from 'react';
import { MapPin, Navigation, Clock, Ruler } from 'lucide-react';
import KakaoMap from './KakaoMap';
import type { RouteMapProps, MapMarker, PolylinePath, LatLng } from '@/types/map';

/**
 * 경로 시각화 컴포넌트
 *
 * - 출발지/도착지를 마커로 표시
 * - 경유지 표시
 * - 폴리라인으로 경로 연결
 * - 예상 거리/시간 표시
 */
export default function RouteMap({
  departure,
  arrival,
  stops = [],
  estimatedDistance,
  estimatedTime,
  className = '',
}: RouteMapProps) {
  // 마커 데이터 생성
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
    ];

    stops.forEach((stop, index) => {
      result.push({
        id: `stop-${index}`,
        lat: stop.lat,
        lng: stop.lng,
        label: `경유지 ${index + 1}: ${stop.address}`,
        type: 'stop',
      });
    });

    return result;
  }, [departure, arrival, stops]);

  // 폴리라인 경로 (출발 -> 경유지들 -> 도착)
  const polyline = useMemo<PolylinePath>(() => {
    const path: LatLng[] = [
      { lat: departure.lat, lng: departure.lng },
      ...stops.map((s) => ({ lat: s.lat, lng: s.lng })),
      { lat: arrival.lat, lng: arrival.lng },
    ];

    return {
      path,
      strokeColor: '#1B6FF4',
      strokeWeight: 4,
      strokeOpacity: 0.8,
    };
  }, [departure, arrival, stops]);

  // 지도 중심 (출발/도착 중간점)
  const center = useMemo<LatLng>(() => ({
    lat: (departure.lat + arrival.lat) / 2,
    lng: (departure.lng + arrival.lng) / 2,
  }), [departure, arrival]);

  return (
    <div className={className}>
      {/* 지도 */}
      <KakaoMap
        center={center}
        zoom={7}
        markers={markers}
        polyline={polyline}
        height="320px"
        className="mb-4"
      />

      {/* 경로 정보 */}
      <div className="space-y-3">
        {/* 출발지 */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#1B6FF4] ring-2 ring-blue-200" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">출발지</p>
            <p className="text-sm text-gray-900">{departure.address}</p>
          </div>
        </div>

        {/* 경유지 */}
        {stops.map((stop, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-gray-400 ring-2 ring-gray-200" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">경유지 {index + 1}</p>
              <p className="text-sm text-gray-900">{stop.address}</p>
            </div>
          </div>
        ))}

        {/* 도착지 */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">도착지</p>
            <p className="text-sm text-gray-900">{arrival.address}</p>
          </div>
        </div>

        {/* 예상 거리/시간 */}
        {(estimatedDistance || estimatedTime) && (
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            {estimatedDistance && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Ruler className="w-4 h-4 text-[#1B6FF4]" />
                <span>거리: <strong className="text-gray-900">{estimatedDistance}</strong></span>
              </div>
            )}
            {estimatedTime && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-[#1B6FF4]" />
                <span>예상 소요: <strong className="text-gray-900">{estimatedTime}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
