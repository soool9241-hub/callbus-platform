// ============================================================
// 콜버스 플랫폼 - 카카오맵 유틸리티
// ============================================================

import type { LatLng, MapMarker, PolylinePath } from '@/types/map';

const KAKAO_MAP_SCRIPT_ID = 'kakao-map-sdk';

/** 마커 타입별 색상 */
const MARKER_COLORS: Record<string, string> = {
  departure: '#1B6FF4', // 파란색 (출발)
  arrival: '#EF4444',   // 빨간색 (도착)
  stop: '#6B7280',      // 회색 (경유지)
  driver: '#10B981',    // 초록색 (기사)
};

/** 카카오맵 SDK 스크립트 로드 여부 확인 */
export function isKakaoMapLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.kakao?.maps;
}

/**
 * 카카오맵 JavaScript SDK를 동적으로 로드합니다.
 * 이미 로드된 경우 즉시 resolve됩니다.
 */
export function loadKakaoMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 서버사이드에서 실행되는 경우
    if (typeof window === 'undefined') {
      reject(new Error('카카오맵은 브라우저 환경에서만 사용할 수 있습니다.'));
      return;
    }

    // 이미 로드된 경우
    if (isKakaoMapLoaded()) {
      resolve();
      return;
    }

    // 이미 스크립트 태그가 삽입되어 있는 경우 (로딩 중)
    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.kakao.maps.load(() => resolve());
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('카카오맵 SDK 로드에 실패했습니다.'));
      });
      return;
    }

    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!appKey) {
      reject(new Error('NEXT_PUBLIC_KAKAO_MAP_KEY 환경변수가 설정되지 않았습니다.'));
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_MAP_SCRIPT_ID;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => resolve());
    };

    script.onerror = () => {
      reject(new Error('카카오맵 SDK 로드에 실패했습니다.'));
    };

    document.head.appendChild(script);
  });
}

/**
 * 카카오맵 인스턴스를 생성합니다.
 */
export function initMap(
  container: HTMLElement,
  options: { center: LatLng; zoom?: number }
): kakao.maps.Map {
  const center = new kakao.maps.LatLng(options.center.lat, options.center.lng);
  const map = new kakao.maps.Map(container, {
    center,
    level: options.zoom ?? 5,
  });
  return map;
}

/**
 * SVG 마커 이미지를 생성합니다.
 */
function createMarkerSvg(color: string, type: string): string {
  if (type === 'driver') {
    // 버스 아이콘
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="${color}" stroke="white" stroke-width="3"/>
        <path d="M12 12h12v10a2 2 0 01-2 2H14a2 2 0 01-2-2V12z" fill="white"/>
        <rect x="12" y="10" width="12" height="3" rx="1" fill="white"/>
        <circle cx="14.5" cy="25" r="1.5" fill="white"/>
        <circle cx="21.5" cy="25" r="1.5" fill="white"/>
      </svg>
    `)}`;
  }

  // 핀 아이콘 (출발/도착/경유지)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>
  `)}`;
}

/**
 * 마커를 지도에 추가합니다.
 */
export function addMarker(
  map: kakao.maps.Map,
  marker: MapMarker,
  onClick?: (marker: MapMarker) => void
): kakao.maps.Marker {
  const position = new kakao.maps.LatLng(marker.lat, marker.lng);
  const color = MARKER_COLORS[marker.type] || '#6B7280';
  const isDriver = marker.type === 'driver';

  const imageSize = isDriver
    ? new kakao.maps.Size(36, 36)
    : new kakao.maps.Size(28, 40);
  const imageOption = isDriver
    ? { offset: new kakao.maps.Point(18, 18) }
    : { offset: new kakao.maps.Point(14, 40) };

  const markerImage = new kakao.maps.MarkerImage(
    createMarkerSvg(color, marker.type),
    imageSize,
    imageOption
  );

  const kakaoMarker = new kakao.maps.Marker({
    position,
    map,
    image: markerImage,
    title: marker.label,
  });

  // 인포윈도우 (클릭 시 라벨 표시)
  if (onClick || marker.label) {
    const infoWindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-size:13px;font-family:Pretendard,sans-serif;white-space:nowrap;border-radius:8px;">${marker.label}</div>`,
      removable: true,
    });

    kakao.maps.event.addListener(kakaoMarker, 'click', () => {
      infoWindow.open(map, kakaoMarker);
      if (onClick) onClick(marker);
    });
  }

  return kakaoMarker;
}

/**
 * 폴리라인을 지도에 추가합니다.
 */
export function addPolyline(
  map: kakao.maps.Map,
  polyline: PolylinePath
): kakao.maps.Polyline {
  const path = polyline.path.map(
    (p) => new kakao.maps.LatLng(p.lat, p.lng)
  );

  const kakaoPolyline = new kakao.maps.Polyline({
    map,
    path,
    strokeWeight: polyline.strokeWeight ?? 4,
    strokeColor: polyline.strokeColor ?? '#1B6FF4',
    strokeOpacity: polyline.strokeOpacity ?? 0.8,
    strokeStyle: 'solid',
  });

  return kakaoPolyline;
}

/**
 * 모든 좌표를 포함하도록 지도 영역을 조절합니다.
 */
export function fitBounds(map: kakao.maps.Map, points: LatLng[]): void {
  if (points.length === 0) return;

  const bounds = new kakao.maps.LatLngBounds();
  points.forEach((point) => {
    bounds.extend(new kakao.maps.LatLng(point.lat, point.lng));
  });

  map.setBounds(bounds);
}

/**
 * 좌표를 주소로 변환합니다. (역지오코딩)
 */
export function coordToAddress(
  lat: number,
  lng: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isKakaoMapLoaded()) {
      reject(new Error('카카오맵 SDK가 로드되지 않았습니다.'));
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        const addr = result[0].road_address
          ? result[0].road_address.address_name
          : result[0].address.address_name;
        resolve(addr);
      } else {
        resolve(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    });
  });
}

/**
 * 주소를 좌표로 변환합니다. (지오코딩)
 */
export function addressToCoord(
  address: string
): Promise<{ lat: number; lng: number; address: string }> {
  return new Promise((resolve, reject) => {
    if (!isKakaoMapLoaded()) {
      reject(new Error('카카오맵 SDK가 로드되지 않았습니다.'));
      return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        resolve({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x),
          address: result[0].address_name,
        });
      } else {
        reject(new Error('주소를 찾을 수 없습니다.'));
      }
    });
  });
}

/**
 * 키워드로 장소를 검색합니다.
 */
export function searchPlaces(
  keyword: string
): Promise<kakao.maps.services.PlacesSearchResult[]> {
  return new Promise((resolve, reject) => {
    if (!isKakaoMapLoaded()) {
      reject(new Error('카카오맵 SDK가 로드되지 않았습니다.'));
      return;
    }

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve(result);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        resolve([]);
      } else {
        reject(new Error('장소 검색에 실패했습니다.'));
      }
    });
  });
}
