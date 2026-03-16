'use client';

import { useParams } from 'next/navigation';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { customerChatMessages, customerChatRooms } from '@/lib/chat-mock-data';

export default function CustomerChatRoomPage() {
  const params = useParams();
  const roomId = params.id as string;

  // Find the room info
  const room = customerChatRooms.find((r) => r.id === roomId);
  const partnerName = room?.name || '기사님';
  const partnerAvatar = room?.avatar || '?';
  const isOnline = room?.isOnline ?? false;

  // Filter messages for this room (or show all mock messages for the first room)
  const messages = customerChatMessages.filter(
    (m) => m.roomId === roomId || m.roomId === 'cust-chat-001'
  ).map((m) => ({
    ...m,
    roomId, // Ensure messages point to current room
  }));

  return (
    <ChatRoom
      roomId={roomId}
      currentUserId="customer-001"
      currentUserName="나"
      partnerName={partnerName}
      partnerAvatar={partnerAvatar}
      isOnline={isOnline}
      reservationId="res-001"
      backHref="/customer/chat"
      initialMessages={messages}
    />
  );
}
