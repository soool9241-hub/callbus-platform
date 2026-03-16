'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export interface ChatRoomItem {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  subtitle?: string;
}

interface ChatListProps {
  rooms: ChatRoomItem[];
  basePath: string; // e.g., '/customer/chat' or '/driver/chat'
  emptyMessage?: string;
  tabs?: { key: string; label: string }[];
  filterFn?: (room: ChatRoomItem, tab: string) => boolean;
}

export function ChatList({
  rooms,
  basePath,
  emptyMessage = '아직 대화가 없습니다',
  tabs,
  filterFn,
}: ChatListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key || 'all');

  const filtered = useMemo(() => {
    let result = rooms;

    // Apply tab filter
    if (tabs && filterFn && activeTab !== 'all') {
      result = result.filter((room) => filterFn(room, activeTab));
    }

    // Apply search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(q) ||
          room.lastMessage.toLowerCase().includes(q) ||
          room.subtitle?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [rooms, search, activeTab, tabs, filterFn]);

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
      {tabs && tabs.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#1B6FF4] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Room list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{emptyMessage}</p>
          </div>
        )}

        {filtered.map((room) => (
          <Card
            key={room.id}
            hover
            padding="none"
            className="cursor-pointer"
            onClick={() => router.push(`${basePath}/${room.id}`)}
          >
            <div className="flex items-center gap-3 p-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full ${room.avatarColor} flex items-center justify-center font-bold text-lg`}
                >
                  {room.avatar}
                </div>
                {room.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#10B981] border-2 border-white rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {room.name}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {room.time}
                  </span>
                </div>
                {room.subtitle && (
                  <p className="text-xs text-gray-400 truncate mb-0.5">{room.subtitle}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                  {room.unreadCount > 0 && (
                    <span className="flex-shrink-0 ml-2 min-w-[20px] h-5 px-1.5 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {room.unreadCount > 99 ? '99+' : room.unreadCount}
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
