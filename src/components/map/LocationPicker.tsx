'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import KakaoMap from './KakaoMap';
import { isKakaoMapLoaded, searchPlaces, coordToAddress } from '@/lib/kakaoMap';
import type { LocationPickerProps, LocationWithAddress, MapMarker } from '@/types/map';

/**
 * 위치 검색 및 선택 컴포넌트
 *
 * - 카카오 주소 검색 API를 이용한 장소 검색
 * - 검색 결과 드롭다운
 * - 지도 클릭으로 위치 선택
 * - 선택된 위치 주소 표시
 */
export default function LocationPicker({
  value,
  onSelect,
  placeholder = '주소 또는 장소를 검색하세요',
  className = '',
}: LocationPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    { place_name: string; address_name: string; lat: number; lng: number }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    value ? { lat: value.lat, lng: value.lng } : { lat: 37.5665, lng: 126.978 }
  );

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 (디바운스)
  const handleSearch = useCallback((keyword: string) => {
    setQuery(keyword);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!keyword.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (!isKakaoMapLoaded()) {
        // SDK가 로드되지 않은 경우 목업 결과
        setResults([
          { place_name: `${keyword} (서울역 부근)`, address_name: '서울 용산구 한강대로 405', lat: 37.5547, lng: 126.9707 },
          { place_name: `${keyword} (강남역 부근)`, address_name: '서울 강남구 강남대로 396', lat: 37.4979, lng: 127.0276 },
          { place_name: `${keyword} (잠실 부근)`, address_name: '서울 송파구 올림픽로 300', lat: 37.5133, lng: 127.1001 },
        ]);
        setShowResults(true);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const places = await searchPlaces(keyword);
        setResults(
          places.slice(0, 8).map((p) => ({
            place_name: p.place_name,
            address_name: p.road_address_name || p.address_name,
            lat: parseFloat(p.y),
            lng: parseFloat(p.x),
          }))
        );
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  // 검색 결과 선택
  const handleSelectResult = useCallback(
    (result: { place_name: string; address_name: string; lat: number; lng: number }) => {
      const location: LocationWithAddress = {
        lat: result.lat,
        lng: result.lng,
        address: result.address_name,
      };
      onSelect(location);
      setQuery(result.place_name);
      setShowResults(false);
      setMapCenter({ lat: result.lat, lng: result.lng });
    },
    [onSelect]
  );

  // 지도 클릭으로 위치 선택
  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      if (isKakaoMapLoaded()) {
        try {
          address = await coordToAddress(lat, lng);
        } catch {
          // 역지오코딩 실패 시 좌표 표시
        }
      }

      const location: LocationWithAddress = { lat, lng, address };
      onSelect(location);
      setQuery(address);
      setMapCenter({ lat, lng });
    },
    [onSelect]
  );

  // 선택 초기화
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onSelect({ lat: 0, lng: 0, address: '' });
  }, [onSelect]);

  // 선택된 위치 마커
  const markers: MapMarker[] = value && value.lat !== 0
    ? [
        {
          id: 'selected',
          lat: value.lat,
          lng: value.lng,
          label: value.address,
          type: 'departure',
        },
      ]
    : [];

  return (
    <div className={`space-y-3 ${className}`} ref={containerRef}>
      {/* 검색 입력 */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#1B6FF4] focus:border-transparent
                       placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 로딩 표시 */}
        {isSearching && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-[#1B6FF4] animate-spin" />
          </div>
        )}

        {/* 검색 결과 드롭다운 */}
        {showResults && results.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelectResult(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3 border-b border-gray-50 last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-[#1B6FF4] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.place_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.address_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 검색 결과 없음 */}
        {showResults && results.length === 0 && query.trim() && !isSearching && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
            <p className="text-sm text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* 지도 (클릭으로 위치 선택) */}
      <div className="relative">
        <KakaoMap
          center={mapCenter}
          zoom={5}
          markers={markers}
          height="240px"
          onClick={handleMapClick}
        />
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-md px-2.5 py-1.5 text-xs text-gray-500">
          지도를 클릭하여 위치를 선택할 수 있습니다
        </div>
      </div>

      {/* 선택된 위치 표시 */}
      {value && value.lat !== 0 && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <MapPin className="w-4 h-4 text-[#1B6FF4] mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-[#1B6FF4] font-medium">선택된 위치</p>
            <p className="text-sm text-gray-900 break-all">{value.address}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
