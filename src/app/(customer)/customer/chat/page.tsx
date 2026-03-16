'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Search, MessageSquare } from 'lucide-react';

type ChatTab = 'all' | 'driver' | 'pension';

const tabs: { key: ChatTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'driver', label: '기사' },
  { key: 'pension', label: '펜션' },
];

const mockChatRooms = [
  {
    id: 'chat-001',
    name: '박정훈 기사님',
    type: 'driver' as const,
    avatar: '박',
    avatarColor: 'bg-blue-100 text-blue-600',
    lastMessage: '네, 출발 시간 확인했습니다. 10분 전에 도착하겠습니다.',
    time: '오후 3:42',
    unread: 2,
  },
  {
    id: 'chat-002',
    name: '속초 오션뷰 펜션',
    type: 'pension' as const,
    avatar: '속',
    avatarColor: 'bg-green-100 text-green-600',
    lastMessage: '체크인은 15시부터 가능합니다. 바비큐 그릴도 준비되어 있습니다.',
    time: '오후 1:15',
    unread: 0,
  },
  {
    id: 'chat-003',
    name: '최영호 기사님',
    type: 'driver' as const,
    avatar: '최',
    avatarColor: 'bg-purple-100 text-purple-600',
    lastMessage: '견적서 보내드렸습니다. 확인 부탁드립니다.',
    time: '어제',
    unread: 1,
  },
  {
    id: 'chat-004',
    name: '가평 숲속 글램핑',
    type: 'pension' as const,
    avatar: '가',
    avatarColor: 'bg-amber-100 text-amber-600',
    lastMessage: '예약 확인되었습니다. 감사합니다!',
    time: '3일 전',
    unread: 0,
  },
];

export default function ChatListPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ChatTab>('all');

  const filtered = mockChatRooms.filter((room) => {
    if (activeTab !== 'all' && room.type !== activeTab) return false;
    if (search && !room.name.includes(search) && !room.lastMessage.includes(search)) return false;
    return true;
  });

  return (
    <div className="py-2 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">채팅</h1>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="대화 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefixIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Rooms */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>채팅 내역이 없습니다.</p>
          </div>
        )}

        {filtered.map((room) => (
          <Card
            key={room.id}
            hover
            padding="none"
            className="cursor-pointer"
            onClick={() => router.push(`/chat/${room.id}`)}
          >
            <div className="flex items-center gap-3 p-4">
              <div className={`w-12 h-12 rounded-full ${room.avatarColor} flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                {room.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">{room.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{room.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                  {room.unread > 0 && (
                    <span className="flex-shrink-0 ml-2 w-5 h-5 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {room.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
