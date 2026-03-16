import { supabase } from './supabase'

// ============= Quote Requests =============
export async function createQuoteRequest(data: {
  customer_id: string
  request_number: string
  departure_address: string
  destination_address: string
  departure_datetime: string
  return_datetime?: string
  trip_type: string
  passenger_count: number
  vehicle_type: string[]
  purpose?: string
  special_requests?: string
  contact_phone: string
  waypoints?: any[]
}) {
  return supabase.from('quote_requests').insert(data).select().single()
}

export async function getQuoteRequests(filters?: { status?: string; customer_id?: string }) {
  let query = supabase.from('quote_requests').select('*, profiles!customer_id(name, phone)').order('created_at', { ascending: false })
  if (filters?.status && filters.status !== 'all') query = query.eq('status', filters.status)
  if (filters?.customer_id) query = query.eq('customer_id', filters.customer_id)
  return query
}

export async function getQuoteRequestById(id: string) {
  return supabase.from('quote_requests').select('*, profiles!customer_id(name, phone, email)').eq('id', id).single()
}

// ============= Quotes =============
export async function createQuote(data: {
  request_id: string
  driver_id: string
  vehicle_id: string
  base_price: number
  toll_fee?: number
  meal_fee?: number
  parking_fee?: number
  total_price: number
  vat_included?: boolean
  message?: string
}) {
  return supabase.from('quotes').insert(data).select().single()
}

export async function getQuotesForRequest(requestId: string) {
  return supabase
    .from('quotes')
    .select('*, drivers(*, profiles!user_id(name, phone)), vehicles(*)')
    .eq('request_id', requestId)
    .order('total_price', { ascending: true })
}

export async function getDriverQuotes(driverId: string) {
  return supabase
    .from('quotes')
    .select('*, quote_requests(*)')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false })
}

// ============= Reservations =============
export async function createReservation(data: {
  reservation_number: string
  quote_id: string
  customer_id: string
  driver_id: string
  total_amount: number
  deposit_amount: number
  remaining_amount: number
}) {
  return supabase.from('reservations').insert(data).select().single()
}

export async function getReservations(filters?: { customer_id?: string; driver_id?: string; status?: string }) {
  let query = supabase.from('reservations').select(`
    *,
    quotes(*, quote_requests(*), vehicles(*)),
    profiles!customer_id(name, phone),
    drivers(*, profiles!user_id(name))
  `).order('created_at', { ascending: false })
  if (filters?.customer_id) query = query.eq('customer_id', filters.customer_id)
  if (filters?.status && filters.status !== 'all') query = query.eq('status', filters.status)
  return query
}

export async function updateReservationStatus(id: string, status: string) {
  return supabase.from('reservations').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
}

// ============= Reviews =============
export async function createReview(data: {
  reservation_id: string
  customer_id: string
  driver_id: string
  rating: number
  content?: string
  photos?: string[]
}) {
  return supabase.from('reviews').insert(data).select().single()
}

export async function getReviews(driverId?: string) {
  let query = supabase.from('reviews').select('*, profiles!customer_id(name, profile_image)').eq('is_visible', true).order('created_at', { ascending: false })
  if (driverId) query = query.eq('driver_id', driverId)
  return query
}

// ============= Vehicles =============
export async function getDriverVehicles(driverId: string) {
  return supabase.from('vehicles').select('*').eq('driver_id', driverId).order('created_at', { ascending: false })
}

export async function createVehicle(data: {
  driver_id: string
  vehicle_type: string
  vehicle_name: string
  plate_number: string
  seats: number
  year: number
  options?: string[]
}) {
  return supabase.from('vehicles').insert(data).select().single()
}

export async function updateVehicle(id: string, updates: Record<string, any>) {
  return supabase.from('vehicles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
}

export async function deleteVehicle(id: string) {
  return supabase.from('vehicles').delete().eq('id', id)
}

// ============= Drivers =============
export async function getDriverByUserId(userId: string) {
  return supabase.from('drivers').select('*').eq('user_id', userId).single()
}

// ============= Chat =============
export async function getChatRooms(userId: string) {
  return supabase
    .from('chat_rooms')
    .select('*, profiles!customer_id(name, profile_image), profiles!driver_id(name, profile_image)')
    .or(`customer_id.eq.${userId},driver_id.eq.${userId}`)
    .order('last_message_at', { ascending: false })
}

export async function getChatMessages(roomId: string) {
  return supabase
    .from('chat_messages')
    .select('*, profiles!sender_id(name, profile_image)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
}

export async function sendChatMessage(data: { room_id: string; sender_id: string; content: string; message_type?: string }) {
  const { data: msg, error } = await supabase.from('chat_messages').insert(data).select().single()
  if (!error) {
    await supabase.from('chat_rooms').update({ last_message: data.content, last_message_at: new Date().toISOString() }).eq('id', data.room_id)
  }
  return { data: msg, error }
}

// ============= Notifications =============
export async function getNotifications(userId: string) {
  return supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
}

export async function markNotificationRead(id: string) {
  return supabase.from('notifications').update({ is_read: true }).eq('id', id)
}

export async function markAllNotificationsRead(userId: string) {
  return supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
}

// ============= Realtime Subscriptions =============
export function subscribeToQuotes(requestId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`quotes:${requestId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quotes', filter: `request_id=eq.${requestId}` }, callback)
    .subscribe()
}

export function subscribeToQuoteRequests(callback: (payload: any) => void) {
  return supabase
    .channel('new_quote_requests')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quote_requests' }, callback)
    .subscribe()
}

export function subscribeToChatMessages(roomId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`chat:${roomId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` }, callback)
    .subscribe()
}

export function subscribeToNotifications(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, callback)
    .subscribe()
}
