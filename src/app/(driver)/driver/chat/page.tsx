'use client';

import { ChatList } from '@/components/chat/ChatList';
import { driverChatRooms } from '@/lib/chat-mock-data';

export default function DriverChatListPage() {
  return (
    <ChatList
      rooms={driverChatRooms}
      basePath="/driver/chat"
      emptyMessage="아직 대화가 없습니다"
      tabs={[
        { key: 'all', label: '전체' },
        { key: 'unread', label: '읽지 않음' },
        { key: 'active', label: '운행 예정' },
      ]}
      filterFn={(room, tab) => {
        if (tab === 'unread') return room.unreadCount > 0;
        if (tab === 'active') return room.isOnline || room.unreadCount > 0;
        return true;
      }}
    />
  );
}
