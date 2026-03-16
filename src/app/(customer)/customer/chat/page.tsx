'use client';

import { ChatList } from '@/components/chat/ChatList';
import { customerChatRooms } from '@/lib/chat-mock-data';

export default function CustomerChatListPage() {
  return (
    <ChatList
      rooms={customerChatRooms}
      basePath="/customer/chat"
      emptyMessage="아직 대화가 없습니다"
      tabs={[
        { key: 'all', label: '전체' },
        { key: 'active', label: '진행중' },
        { key: 'completed', label: '완료' },
      ]}
      filterFn={(room, tab) => {
        if (tab === 'active') return room.unreadCount > 0 || room.isOnline;
        if (tab === 'completed') return room.unreadCount === 0 && !room.isOnline;
        return true;
      }}
    />
  );
}
