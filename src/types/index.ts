// ============================================================
// 콜버스 플랫폼 - 타입 정의
// ============================================================

// ---------------------- 사용자 ----------------------
export interface User {
  id: string;
  role: 'customer' | 'driver' | 'admin' | 'pension_owner';
  name: string;
  phone: string;
  email: string;
  profile_image: string | null;
  is_active: boolean;
  created_at: string;
}

// ---------------------- 기사 ----------------------
export interface Driver {
  id: string;
  user_id: string;
  company_name: string;
  business_number: string;
  license_type: string;
  license_number: string;
  region: string[];
  rating: number;
  review_count: number;
  total_trips: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  bank_name: string;
  bank_account: string;
  bank_holder: string;
}

// ---------------------- 차량 ----------------------
export type VehicleTypeKey =
  | 'minivan_15'
  | 'bus_25'
  | 'bus_45'
  | 'limousine'
  | 'premium'
  | 'solati'
  | 'sprinter';

export interface Vehicle {
  id: string;
  driver_id: string;
  vehicle_type: VehicleTypeKey;
  vehicle_name: string;
  plate_number: string;
  seats: number;
  year: number;
  photos: string[];
  options: string[];
  is_active: boolean;
}

// ---------------------- 견적 요청 ----------------------
export interface Waypoint {
  address: string;
  lat: number;
  lng: number;
  order: number;
}

export interface QuoteRequest {
  id: string;
  customer_id: string;
  request_number: string;
  departure_address: string;
  departure_lat: number;
  departure_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  waypoints: Waypoint[] | null;
  departure_datetime: string;
  return_datetime: string | null;
  trip_type: 'one_way' | 'round';
  passenger_count: number;
  vehicle_type: string[];
  purpose: string;
  special_requests: string | null;
  contact_phone: string;
  status: 'open' | 'in_progress' | 'reserved' | 'completed' | 'cancelled' | 'expired';
  quote_count: number;
  expires_at: string;
  created_at: string;
}

// ---------------------- 견적 ----------------------
export interface Quote {
  id: string;
  request_id: string;
  driver_id: string;
  vehicle_id: string;
  base_price: number;
  toll_fee: number;
  meal_fee: number;
  parking_fee: number;
  extra_fees: number;
  total_price: number;
  vat_included: boolean;
  message: string;
  status: 'submitted' | 'selected' | 'rejected' | 'expired';
  created_at: string;
  // 조인 시 포함
  driver?: Driver;
  vehicle?: Vehicle;
}

// ---------------------- 예약 ----------------------
export interface Reservation {
  id: string;
  reservation_number: string;
  quote_id: string;
  customer_id: string;
  driver_id: string;
  total_amount: number;
  deposit_amount: number;
  deposit_rate: number;
  remaining_amount: number;
  status:
    | 'pending_payment'
    | 'deposit_paid'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'refunded';
  driver_deposit: number;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  created_at: string;
}

// ---------------------- 결제 ----------------------
export interface Payment {
  id: string;
  reservation_id: string;
  payment_type: 'deposit' | 'remaining' | 'refund';
  amount: number;
  method?: string;
  pg_provider?: string;
  pg_payment_key?: string;
  pg_order_id?: string;
  pg_receipt_url?: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paid_at?: string;
  created_at: string;
}

// ---------------------- 정산 ----------------------
export interface Settlement {
  id: string;
  driver_id: string;
  period_start: string;
  period_end: string;
  total_revenue: number;
  platform_fee: number;
  fee_rate: number;
  net_amount: number;
  trip_count: number;
  status: 'pending' | 'confirmed' | 'paid' | 'disputed';
  paid_at?: string;
  created_at: string;
}

// ---------------------- 리뷰 ----------------------
export interface Review {
  id: string;
  reservation_id: string;
  customer_id: string;
  driver_id: string;
  rating: number;
  content: string;
  photos: string[];
  driver_reply: string | null;
  driver_replied_at: string | null;
  is_visible: boolean;
  created_at: string;
}

// ---------------------- 채팅 ----------------------
export interface ChatRoom {
  id: string;
  request_id: string;
  customer_id: string;
  driver_id: string;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'system';
  content: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
}

// ---------------------- 알림 ----------------------
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

// ---------------------- 펜션 사업자 ----------------------
export interface PensionOwner {
  id: string;
  user_id: string;
  business_name: string;
  business_number: string;
  accommodation_license?: string;
  representative_name: string;
  phone: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  bank_name?: string;
  bank_account?: string;
  bank_holder?: string;
  created_at: string;
  updated_at: string;
}

// ---------------------- 펜션 ----------------------
export interface Pension {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  region: string;
  photos: string[];
  amenities: string[];
  room_count: number;
  max_capacity: number;
  check_in_time: string;
  check_out_time: string;
  price_per_night: number;
  is_active: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

// ---------------------- 패키지 ----------------------
export interface Package {
  id: string;
  pension_id: string;
  pension?: Pension;
  name: string;
  description: string;
  photos: string[];
  region: string;
  trip_type: 'one_way' | 'round';
  duration: string;
  vehicle_type: string;
  min_passengers: number;
  max_passengers: number;
  price_per_person: number;
  pension_cost: number;
  bus_cost: number;
  platform_margin: number;
  total_price: number;
  includes: string[];
  excludes: string[];
  season_start?: string;
  season_end?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// ---------------------- 셔틀 노선 ----------------------
export interface ShuttleRoute {
  id: string;
  pension_id: string;
  pension?: Pension;
  name: string;
  departure_address: string;
  destination_address: string;
  schedule: string;
  vehicle_type: string;
  total_seats: number;
  price_per_seat: number;
  driver_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------- 셔틀 예약 ----------------------
export interface ShuttleBooking {
  id: string;
  route_id: string;
  route?: ShuttleRoute;
  customer_id: string;
  booking_date: string;
  seats: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

// ---------------------- 펜션 정산 ----------------------
export interface PensionSettlement {
  id: string;
  pension_owner_id: string;
  period_start: string;
  period_end: string;
  package_revenue: number;
  shuttle_revenue: number;
  referral_revenue: number;
  total_revenue: number;
  platform_fee: number;
  net_amount: number;
  status: 'pending' | 'confirmed' | 'paid';
  created_at: string;
}

// ---------------------- 가격 동향 ----------------------
export interface PriceTrend {
  id: string;
  departure_region: string;
  destination_region: string;
  vehicle_type: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  sample_count: number;
  period: string;
  created_at: string;
}

// ---------------------- 쿠폰 ----------------------
export interface Coupon {
  id: string;
  code: string;
  name: string;
  discount_type: 'fixed' | 'percent';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number;
  valid_from?: string;
  valid_until?: string;
  max_usage?: number;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

// ---------------------- 매니저 배정 ----------------------
export interface ManagerAssignment {
  id: string;
  reservation_id: string;
  manager_id: string;
  assigned_at: string;
  status: 'active' | 'completed';
}

// ============================================================
// 헬퍼 타입 - 차량 종류 (한국어 라벨)
// ============================================================
export interface VehicleType {
  key: VehicleTypeKey;
  label: string;
  seats: number;
}

// ============================================================
// 헬퍼 타입 - 예약 상태 (한국어 라벨)
// ============================================================
export interface ReservationStatusInfo {
  key: Reservation['status'];
  label: string;
  color: string;
}

// ============================================================
// 상수 정의
// ============================================================

/** 차량 종류 목록 */
export const VEHICLE_TYPES: VehicleType[] = [
  { key: 'minivan_15', label: '15인승 미니밴', seats: 15 },
  { key: 'bus_25', label: '25인승 중형버스', seats: 25 },
  { key: 'bus_45', label: '45인승 대형버스', seats: 45 },
  { key: 'limousine', label: '리무진버스', seats: 45 },
  { key: 'premium', label: '프리미엄버스', seats: 28 },
  { key: 'solati', label: '쏠라티', seats: 12 },
  { key: 'sprinter', label: '스프린터', seats: 16 },
];

/** 이용 목적 목록 */
export const PURPOSES: string[] = [
  '관광/여행',
  '워크숍/단체행사',
  '결혼식/돌잔치',
  '학교/학원 행사',
  '동호회/동문회',
  '기업 셔틀',
  '공항 픽업/샌딩',
  '기타',
];

/** 차량 옵션 목록 */
export const VEHICLE_OPTIONS: string[] = [
  'USB 충전',
  'Wi-Fi',
  '냉장고',
  '노래방',
  '모니터/TV',
  '커튼',
  '리클라이닝 시트',
  '테이블',
  '트렁크 공간',
  '장애인석',
  '카시트 장착 가능',
];

/** 예약 상태 목록 (한국어 라벨 포함) */
export const RESERVATION_STATUSES: ReservationStatusInfo[] = [
  { key: 'pending_payment', label: '결제 대기', color: 'yellow' },
  { key: 'deposit_paid', label: '예약금 결제 완료', color: 'blue' },
  { key: 'confirmed', label: '예약 확정', color: 'green' },
  { key: 'in_progress', label: '운행 중', color: 'indigo' },
  { key: 'completed', label: '운행 완료', color: 'gray' },
  { key: 'cancelled', label: '취소됨', color: 'red' },
  { key: 'refunded', label: '환불 완료', color: 'orange' },
];

/** 펜션 편의시설 목록 */
export const PENSION_AMENITIES = ['바베큐', '수영장', '노래방', '족구장', '와이파이', '주차장', '에어컨', '난방', '취사가능', '세미나실'] as const;

/** 패키지 상태 (한국어 라벨) */
export const PACKAGE_STATUSES: Record<string, string> = {
  draft: '초안',
  pending: '심사중',
  approved: '승인',
  rejected: '반려',
  active: '판매중',
  inactive: '판매중지',
};

/** 셔틀 상태 (한국어 라벨) */
export const SHUTTLE_STATUSES: Record<string, string> = {
  pending: '대기중',
  confirmed: '확정',
  cancelled: '취소',
  completed: '완료',
};

/** 결제 수단 (한국어 라벨) */
export const PAYMENT_METHODS: Record<string, string> = {
  card: '신용카드',
  kakao_pay: '카카오페이',
  naver_pay: '네이버페이',
  toss_pay: '토스페이',
  bank_transfer: '계좌이체',
};
