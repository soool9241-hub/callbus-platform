'use client';

import { ChatList } from '@/components/chat/ChatList';
import { pensionChatRooms } from '@/lib/chat-mock-data';

export default function PensionChatListPage() {
  return (
    <ChatList
      rooms={pensionChatRooms}
      basePath="/pension/chat"
      emptyMessage="아직 대화가 없습니다"
      tabs={[
        { key: 'all', label: '전체' },
        { key: 'unread', label: '읽지 않음' },
      ]}
      filterFn={(room, tab) => {
        if (tab === 'unread') return room.unreadCount > 0;
        return true;
      }}
    />
  );
}
