'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import type { KakaoMapProps, MapMarker } from '@/types/map';
import {
  loadKakaoMapScript,
  isKakaoMapLoaded,
  initMap,
  addMarker,
  addPolyline,
  fitBounds,
} from '@/lib/kakaoMap';

/** 지도 로딩 스켈레톤 */
function MapSkeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-gray-100 rounded-xl animate-pulse"
      style={{ width, height }}
    >
      <MapPin className="w-10 h-10 text-gray-300 mb-2" />
      <p className="text-sm text-gray-400">지도를 불러오는 중...</p>
    </div>
  );
}

/** SDK 로드 실패 시 대체 UI */
function MapFallback({
  width,
  height,
  message,
}: {
  width: string;
  height: string;
  message: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200"
      style={{ width, height }}
    >
      <MapPin className="w-12 h-12 text-gray-300 mb-3" />
      <p className="text-sm text-gray-500 text-center px-4">{message}</p>
    </div>
  );
}

/**
 * 카카오맵 재사용 컴포넌트
 *
 * - 카카오맵 SDK를 동적 로드
 * - 마커, 폴리라인, 클릭 이벤트 지원
 * - SDK 미로드 시 대체 UI 표시
 */
export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 5,
  markers = [],
  polyline,
  width = '100%',
  height = '400px',
  className = '',
  onClick,
  onMarkerClick,
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const polylineRef = useRef<kakao.maps.Polyline | null>(null);

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // SDK 로드
  useEffect(() => {
    loadKakaoMapScript()
      .then(() => setStatus('ready'))
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message || '카카오맵 SDK를 불러올 수 없습니다.');
      });
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (status !== 'ready' || !containerRef.current) return;
    if (!isKakaoMapLoaded()) return;

    const map = initMap(containerRef.current, { center, zoom });
    mapRef.current = map;

    // 지도 클릭 이벤트
    if (onClick) {
      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;
        onClick(latlng.getLat(), latlng.getLng());
      });
    }

    return () => {
      mapRef.current = null;
    };
    // center, zoom은 초기화에만 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // 마커 업데이트
  useEffect(() => {
    if (!mapRef.current || status !== 'ready') return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    markers.forEach((marker) => {
      const kakaoMarker = addMarker(mapRef.current!, marker, onMarkerClick);
      markersRef.current.push(kakaoMarker);
    });

    // 마커가 있으면 영역에 맞추기
    if (markers.length > 1) {
      fitBounds(
        mapRef.current,
        markers.map((m) => ({ lat: m.lat, lng: m.lng }))
      );
    } else if (markers.length === 1) {
      mapRef.current.setCenter(
        new kakao.maps.LatLng(markers[0].lat, markers[0].lng)
      );
    }
  }, [markers, status, onMarkerClick]);

  // 폴리라인 업데이트
  useEffect(() => {
    if (!mapRef.current || status !== 'ready') return;

    // 기존 폴리라인 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // 새 폴리라인 추가
    if (polyline && polyline.path.length > 1) {
      polylineRef.current = addPolyline(mapRef.current, polyline);
    }
  }, [polyline, status]);

  // 센터 변경 반영
  const updateCenter = useCallback(() => {
    if (mapRef.current && status === 'ready') {
      mapRef.current.panTo(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [center.lat, center.lng, status]);

  useEffect(() => {
    updateCenter();
  }, [updateCenter]);

  if (status === 'loading') {
    return <MapSkeleton width={width} height={height} />;
  }

  if (status === 'error') {
    return <MapFallback width={width} height={height} message={errorMessage} />;
  }

  return (
    <div
      ref={containerRef}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ width, height }}
    />
  );
}
