// ============================================================
// 콜버스 플랫폼 - 지도 관련 타입 정의
// ============================================================

/** 위도/경도 좌표 */
export interface LatLng {
  lat: number;
  lng: number;
}

/** 주소 포함 좌표 */
export interface LocationWithAddress extends LatLng {
  address: string;
}

/** 마커 타입 */
export type MarkerType = 'departure' | 'arrival' | 'stop' | 'driver';

/** 지도 마커 */
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: MarkerType;
}

/** 폴리라인 좌표 배열 */
export interface PolylinePath {
  path: LatLng[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

/** KakaoMap 컴포넌트 Props */
export interface KakaoMapProps {
  center?: LatLng;
  zoom?: number;
  markers?: MapMarker[];
  polyline?: PolylinePath;
  width?: string;
  height?: string;
  className?: string;
  onClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (marker: MapMarker) => void;
}

/** RouteMap 컴포넌트 Props */
export interface RouteMapProps {
  departure: LocationWithAddress;
  arrival: LocationWithAddress;
  stops?: LocationWithAddress[];
  estimatedDistance?: string;
  estimatedTime?: string;
  className?: string;
}

/** LocationPicker 컴포넌트 Props */
export interface LocationPickerProps {
  value?: LocationWithAddress | null;
  onSelect: (location: LocationWithAddress) => void;
  placeholder?: string;
  className?: string;
}

/** 기사 위치 정보 */
export interface DriverLocation extends LatLng {
  heading: number;
  speed: number;
  timestamp: string;
}

/** DriverLocationTracker 컴포넌트 Props */
export interface DriverLocationTrackerProps {
  departure: LocationWithAddress;
  arrival: LocationWithAddress;
  stops?: LocationWithAddress[];
  className?: string;
}

/** 카카오 주소 검색 결과 */
export interface KakaoAddressResult {
  address_name: string;
  road_address_name?: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  place_name?: string;
}

// ============================================================
// 카카오맵 SDK 타입 선언
// ============================================================
declare global {
  interface Window {
    kakao: typeof kakao;
  }

  namespace kakao {
    namespace maps {
      class Map {
        constructor(container: HTMLElement, options: MapOptions);
        setCenter(latlng: LatLng): void;
        setLevel(level: number): void;
        getCenter(): LatLng;
        getLevel(): number;
        setBounds(bounds: LatLngBounds): void;
        panTo(latlng: LatLng): void;
      }

      class LatLng {
        constructor(lat: number, lng: number);
        getLat(): number;
        getLng(): number;
      }

      class LatLngBounds {
        constructor();
        extend(latlng: LatLng): void;
      }

      class Marker {
        constructor(options: MarkerOptions);
        setMap(map: Map | null): void;
        setPosition(position: LatLng): void;
        setImage(image: MarkerImage): void;
        getPosition(): LatLng;
      }

      class MarkerImage {
        constructor(
          src: string,
          size: Size,
          options?: { offset?: Point }
        );
      }

      class InfoWindow {
        constructor(options: InfoWindowOptions);
        open(map: Map, marker: Marker): void;
        close(): void;
        setContent(content: string): void;
      }

      class Polyline {
        constructor(options: PolylineOptions);
        setMap(map: Map | null): void;
        getLength(): number;
      }

      class Size {
        constructor(width: number, height: number);
      }

      class Point {
        constructor(x: number, y: number);
      }

      class CustomOverlay {
        constructor(options: CustomOverlayOptions);
        setMap(map: Map | null): void;
        setPosition(position: LatLng): void;
      }

      namespace event {
        function addListener(
          target: Map | Marker,
          type: string,
          callback: (...args: any[]) => void
        ): void;
        function removeListener(
          target: Map | Marker,
          type: string,
          callback: (...args: any[]) => void
        ): void;
      }

      namespace services {
        class Places {
          keywordSearch(
            keyword: string,
            callback: (
              result: PlacesSearchResult[],
              status: Status
            ) => void,
            options?: PlacesSearchOptions
          ): void;
        }

        class Geocoder {
          addressSearch(
            address: string,
            callback: (
              result: GeocoderResult[],
              status: Status
            ) => void
          ): void;
          coord2Address(
            lng: number,
            lat: number,
            callback: (
              result: Coord2AddressResult[],
              status: Status
            ) => void
          ): void;
        }

        interface PlacesSearchResult {
          id: string;
          place_name: string;
          address_name: string;
          road_address_name: string;
          x: string;
          y: string;
          phone: string;
          category_name: string;
        }

        interface PlacesSearchOptions {
          location?: LatLng;
          radius?: number;
          size?: number;
          page?: number;
        }

        interface GeocoderResult {
          address_name: string;
          road_address?: {
            address_name: string;
          };
          x: string;
          y: string;
        }

        interface Coord2AddressResult {
          address: {
            address_name: string;
          };
          road_address?: {
            address_name: string;
          };
        }

        enum Status {
          OK = 'OK',
          ZERO_RESULT = 'ZERO_RESULT',
          ERROR = 'ERROR',
        }
      }

      interface MapOptions {
        center: LatLng;
        level?: number;
      }

      interface MarkerOptions {
        position: LatLng;
        map?: Map;
        image?: MarkerImage;
        title?: string;
      }

      interface InfoWindowOptions {
        content?: string;
        removable?: boolean;
        position?: LatLng;
      }

      interface PolylineOptions {
        map?: Map;
        path: LatLng[];
        strokeWeight?: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeStyle?: string;
      }

      interface CustomOverlayOptions {
        map?: Map;
        position: LatLng;
        content: string | HTMLElement;
        xAnchor?: number;
        yAnchor?: number;
        zIndex?: number;
      }

      function load(callback: () => void): void;
    }
  }
}

export {};
