'use client';

import { useParams } from 'next/navigation';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { driverChatMessages, driverChatRooms } from '@/lib/chat-mock-data';

export default function DriverChatRoomPage() {
  const params = useParams();
  const roomId = params.id as string;

  // Find the room info
  const room = driverChatRooms.find((r) => r.id === roomId);
  const partnerName = room?.name || '고객님';
  const partnerAvatar = room?.avatar || '?';
  const isOnline = room?.isOnline ?? false;

  // Filter messages for this room (or show all mock messages for the first room)
  const messages = driverChatMessages.filter(
    (m) => m.roomId === roomId || m.roomId === 'drv-chat-001'
  ).map((m) => ({
    ...m,
    roomId,
  }));

  return (
    <ChatRoom
      roomId={roomId}
      currentUserId="driver-001"
      currentUserName="나"
      partnerName={partnerName}
      partnerAvatar={partnerAvatar}
      isOnline={isOnline}
      reservationId="res-002"
      backHref="/driver/chat"
      initialMessages={messages}
    />
  );
}
