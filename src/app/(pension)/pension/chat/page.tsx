'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Clock,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TabList, Tab } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';

const mockDriverChats = [
  {
    id: 'chat-d1',
    partnerName: '김기사',
    lastMessage: '이번 주 금요일 셔틀 배차 확인 부탁드립니다.',
    time: '10분 전',
    unread: 2,
    avatar: '김',
  },
  {
    id: 'chat-d2',
    partnerName: '이기사',
    lastMessage: '견적 확인했습니다. 45인승 가능합니다.',
    time: '1시간 전',
    unread: 0,
    avatar: '이',
  },
];

const mockCustomerChats = [
  {
    id: 'chat-c1',
    partnerName: '박서연',
    lastMessage: '체크인 시간 변경 가능한가요?',
    time: '30분 전',
    unread: 1,
    avatar: '박',
  },
  {
    id: 'chat-c2',
    partnerName: '김민수',
    lastMessage: '감사합니다! 즐거운 여행이었어요.',
    time: '2시간 전',
    unread: 0,
    avatar: '김',
  },
  {
    id: 'chat-c3',
    partnerName: '최영호',
    lastMessage: '워크숍 패키지 관련 문의드립니다.',
    time: '어제',
    unread: 3,
    avatar: '최',
  },
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('driver');
  const [searchQuery, setSearchQuery] = useState('');

  const chats = activeTab === 'driver' ? mockDriverChats : mockCustomerChats;

  const filteredChats = chats.filter((chat) =>
    chat.partnerName.includes(searchQuery) ||
    chat.lastMessage.includes(searchQuery)
  );

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">채팅</h1>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <TabList activeValue={activeTab} onChange={setActiveTab} className="w-full">
          <Tab value="driver">기사 채팅</Tab>
          <Tab value="customer">고객 채팅</Tab>
        </TabList>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="이름 또는 메시지 검색"
          prefixIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Chat List */}
      {filteredChats.length === 0 ? (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-3">
            <MessageCircle className="w-12 h-12 text-gray-300" />
            <p className="text-gray-500">채팅 내역이 없습니다.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <Card key={chat.id} hover className="cursor-pointer">
              <div className="p-4 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#1B6FF4] flex items-center justify-center text-white font-medium text-lg shrink-0">
                  {chat.avatar}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{chat.partnerName}</p>
                    <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate pr-2">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-[#FF6B35] rounded-full shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
