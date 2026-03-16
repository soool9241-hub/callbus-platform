import { supabase } from './supabase';

// ============================================================
// Types
// ============================================================

export type MessageType = 'text' | 'image' | 'file' | 'system' | 'location';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: MessageType;
  imageUrl?: string;
  fileName?: string;
  fileUrl?: string;
  latitude?: number;
  longitude?: number;
  locationLabel?: string;
  isRead: boolean;
  createdAt: string; // ISO string
}

export interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageAt: string; // ISO string
  lastMessageTime: string; // display string
  unreadCount: number;
  isOnline: boolean;
  participants: ChatParticipant[];
  reservationId?: string;
  routeInfo?: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: 'customer' | 'driver' | 'pension';
  avatar: string;
  isOnline: boolean;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

// ============================================================
// Supabase Realtime subscriptions (with mock fallback)
// ============================================================

const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes('placeholder');
};

const activeChannels: Map<string, ReturnType<typeof supabase.channel>> = new Map();

/**
 * Subscribe to realtime messages in a chat room.
 */
export function subscribeToChatRoom(
  roomId: string,
  onMessage: (message: ChatMessage) => void
): () => void {
  if (!isSupabaseConfigured()) {
    // Mock: no-op subscription, return cleanup
    return () => {};
  }

  const channel = supabase
    .channel(`chat:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const row = payload.new as Record<string, unknown>;
        const message: ChatMessage = {
          id: row.id as string,
          roomId: row.room_id as string,
          senderId: row.sender_id as string,
          senderName: row.sender_name as string,
          content: row.content as string,
          type: (row.type as MessageType) || 'text',
          imageUrl: row.image_url as string | undefined,
          fileName: row.file_name as string | undefined,
          fileUrl: row.file_url as string | undefined,
          latitude: row.latitude as number | undefined,
          longitude: row.longitude as number | undefined,
          locationLabel: row.location_label as string | undefined,
          isRead: row.is_read as boolean,
          createdAt: row.created_at as string,
        };
        onMessage(message);
      }
    )
    .subscribe();

  activeChannels.set(roomId, channel);

  return () => {
    unsubscribeFromChatRoom(roomId);
  };
}

/**
 * Unsubscribe from a chat room's realtime channel.
 */
export function unsubscribeFromChatRoom(roomId: string): void {
  const channel = activeChannels.get(roomId);
  if (channel) {
    supabase.removeChannel(channel);
    activeChannels.delete(roomId);
  }
}

/**
 * Subscribe to typing indicators in a chat room.
 */
export function subscribeToTyping(
  roomId: string,
  onTyping: (indicator: TypingIndicator) => void
): () => void {
  if (!isSupabaseConfigured()) {
    return () => {};
  }

  const channel = supabase
    .channel(`typing:${roomId}`)
    .on('broadcast', { event: 'typing' }, (payload) => {
      onTyping(payload.payload as TypingIndicator);
    })
    .subscribe();

  activeChannels.set(`typing:${roomId}`, channel);

  return () => {
    const ch = activeChannels.get(`typing:${roomId}`);
    if (ch) {
      supabase.removeChannel(ch);
      activeChannels.delete(`typing:${roomId}`);
    }
  };
}

/**
 * Broadcast typing status.
 */
export function sendTypingIndicator(
  roomId: string,
  userId: string,
  userName: string,
  isTyping: boolean
): void {
  if (!isSupabaseConfigured()) return;

  const channel = activeChannels.get(`typing:${roomId}`);
  if (channel) {
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, userName, isTyping } satisfies TypingIndicator,
    });
  }
}

// ============================================================
// CRUD operations (with mock fallback)
// ============================================================

/**
 * Send a message to a chat room.
 */
export async function sendMessage(
  roomId: string,
  senderId: string,
  senderName: string,
  content: string,
  type: MessageType = 'text',
  extra?: {
    imageUrl?: string;
    fileName?: string;
    fileUrl?: string;
    latitude?: number;
    longitude?: number;
    locationLabel?: string;
  }
): Promise<ChatMessage> {
  if (!isSupabaseConfigured()) {
    // Return mock message
    const now = new Date().toISOString();
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      roomId,
      senderId,
      senderName,
      content,
      type,
      imageUrl: extra?.imageUrl,
      fileName: extra?.fileName,
      fileUrl: extra?.fileUrl,
      latitude: extra?.latitude,
      longitude: extra?.longitude,
      locationLabel: extra?.locationLabel,
      isRead: false,
      createdAt: now,
    };
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      sender_name: senderName,
      content,
      type,
      image_url: extra?.imageUrl,
      file_name: extra?.fileName,
      file_url: extra?.fileUrl,
      latitude: extra?.latitude,
      longitude: extra?.longitude,
      location_label: extra?.locationLabel,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    roomId: data.room_id,
    senderId: data.sender_id,
    senderName: data.sender_name,
    content: data.content,
    type: data.type,
    imageUrl: data.image_url,
    fileName: data.file_name,
    fileUrl: data.file_url,
    latitude: data.latitude,
    longitude: data.longitude,
    locationLabel: data.location_label,
    isRead: data.is_read,
    createdAt: data.created_at,
  };
}

/**
 * Fetch chat rooms for a user.
 */
export async function getChatRooms(userId: string): Promise<ChatRoom[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .contains('participant_ids', [userId])
    .order('last_message_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar || row.name?.charAt(0) || '?',
    avatarColor: row.avatar_color || 'bg-blue-100 text-blue-600',
    lastMessage: row.last_message || '',
    lastMessageAt: row.last_message_at || row.created_at,
    lastMessageTime: '',
    unreadCount: row.unread_count || 0,
    isOnline: false,
    participants: [],
    reservationId: row.reservation_id,
    routeInfo: row.route_info,
  }));
}

/**
 * Fetch messages for a chat room with pagination.
 */
export async function getChatMessages(
  roomId: string,
  limit = 50,
  offset = 0
): Promise<ChatMessage[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    roomId: row.room_id,
    senderId: row.sender_id,
    senderName: row.sender_name,
    content: row.content,
    type: row.type || 'text',
    imageUrl: row.image_url,
    fileName: row.file_name,
    fileUrl: row.file_url,
    latitude: row.latitude,
    longitude: row.longitude,
    locationLabel: row.location_label,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
}

/**
 * Mark all messages in a room as read for a given user.
 */
export async function markAsRead(roomId: string, userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('room_id', roomId)
    .neq('sender_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

// ============================================================
// Date formatting helpers
// ============================================================

export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateSeparator(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function isSameDay(iso1: string, iso2: string): boolean {
  const d1 = new Date(iso1);
  const d2 = new Date(iso2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
