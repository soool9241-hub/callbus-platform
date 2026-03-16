'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { TabList, Tab } from '@/components/ui/Tabs';

interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  category: '고객' | '펜션사업주';
}

const mockChatRooms: ChatRoom[] = [
  {
    id: 'chat-1',
    name: '김민수',
    avatar: '김',
    lastMessage: '안녕하세요, 출발 시간 확인 부탁드립니다.',
    time: '오후 2:30',
    unread: 2,
    category: '고객',
  },
  {
    id: 'chat-2',
    name: '이수진',
    avatar: '이',
    lastMessage: '감사합니다! 내일 뵙겠습니다.',
    time: '오전 11:15',
    unread: 0,
    category: '고객',
  },
  {
    id: 'chat-3',
    name: '가평 힐링펜션',
    avatar: '펜',
    lastMessage: '차량 도착 시간이 변경되었습니다. 확인 부탁드립니다.',
    time: '어제',
    unread: 1,
    category: '펜션사업주',
  },
  {
    id: 'chat-4',
    name: '속초 바다펜션',
    avatar: '속',
    lastMessage: '다음 주 예약 건 관련하여 연락드립니다.',
    time: '3월 14일',
    unread: 0,
    category: '펜션사업주',
  },
];

export default function ChatListPage() {
  const [activeTab, setActiveTab] = useState('고객');

  const filtered = mockChatRooms.filter((room) => room.category === activeTab);

  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">채팅</h1>

      <TabList activeValue={activeTab} onChange={setActiveTab} className="mb-6 w-full">
        <Tab value="고객">고객</Tab>
        <Tab value="펜션사업주">펜션사업주</Tab>
      </TabList>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">채팅 내역이 없습니다.</p>
          </Card>
        ) : (
          filtered.map((room) => (
            <Link key={room.id} href={`/chat/${room.id}`}>
              <Card hover>
                <div className="p-4 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#1B6FF4] flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {room.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{room.name}</h3>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">{room.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                  </div>

                  {/* Unread + Chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    {room.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#FF6B35] text-white text-xs flex items-center justify-center font-bold">
                        {room.unread}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
