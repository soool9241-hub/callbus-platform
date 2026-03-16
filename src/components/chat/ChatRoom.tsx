'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import type { ChatMessage, MessageType } from '@/lib/chat';
import {
  subscribeToChatRoom,
  sendMessage,
  sendTypingIndicator,
  subscribeToTyping,
  formatDateSeparator,
  isSameDay,
} from '@/lib/chat';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';

interface ChatRoomProps {
  roomId: string;
  currentUserId: string;
  currentUserName: string;
  partnerName: string;
  partnerAvatar: string;
  isOnline?: boolean;
  reservationId?: string;
  backHref?: string;
  initialMessages: ChatMessage[];
}

export function ChatRoom({
  roomId,
  currentUserId,
  currentUserName,
  partnerName,
  partnerAvatar,
  isOnline = false,
  reservationId,
  backHref,
  initialMessages,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [partnerTyping, setPartnerTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);

  // Scroll to bottom on initial render
  useEffect(() => {
    if (isFirstRender.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => scrollToBottom(false), 50);
      isFirstRender.current = false;
    }
  }, [scrollToBottom]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isFirstRender.current && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      // Auto-scroll if the message is from us, or if we're near the bottom
      if (lastMsg.senderId === currentUserId) {
        scrollToBottom();
      } else {
        const container = messagesContainerRef.current;
        if (container) {
          const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 150;
          if (isNearBottom) {
            scrollToBottom();
          }
        }
      }
    }
  }, [messages, currentUserId, scrollToBottom]);

  // Subscribe to realtime messages
  useEffect(() => {
    const unsubMessages = subscribeToChatRoom(roomId, (newMsg) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    const unsubTyping = subscribeToTyping(roomId, (indicator) => {
      if (indicator.userId !== currentUserId) {
        setPartnerTyping(indicator.isTyping);
        // Auto-clear after 4s
        if (indicator.isTyping) {
          setTimeout(() => setPartnerTyping(false), 4000);
        }
      }
    });

    return () => {
      unsubMessages();
      unsubTyping();
    };
  }, [roomId, currentUserId]);

  // Load more messages on scroll up
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMore || !hasMore) return;

    if (container.scrollTop < 60) {
      setIsLoadingMore(true);
      // Simulate loading more messages (mock)
      setTimeout(() => {
        setIsLoadingMore(false);
        setHasMore(false); // In mock mode, no more messages
      }, 800);
    }
  }, [isLoadingMore, hasMore]);

  // Handle sending a message
  const handleSend = async (content: string, type?: MessageType) => {
    const newMsg = await sendMessage(
      roomId,
      currentUserId,
      currentUserName,
      content,
      type || 'text'
    );
    setMessages((prev) => [...prev, newMsg]);
  };

  // Handle typing indicator
  const handleTyping = (isTyping: boolean) => {
    sendTypingIndicator(roomId, currentUserId, currentUserName, isTyping);
  };

  // Group messages by date
  const renderMessages = () => {
    const elements: React.ReactNode[] = [];

    messages.forEach((msg, index) => {
      // Add date separator
      const prevMsg = index > 0 ? messages[index - 1] : null;
      if (!prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt)) {
        elements.push(
          <div key={`date-${msg.createdAt}`} className="flex justify-center my-4">
            <span className="text-xs text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full font-medium">
              {formatDateSeparator(msg.createdAt)}
            </span>
          </div>
        );
      }

      elements.push(
        <ChatBubble
          key={msg.id}
          message={msg}
          isMine={msg.senderId === currentUserId}
          showReadReceipt={msg.senderId === currentUserId}
        />
      );
    });

    return elements;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto bg-white">
      {/* Header */}
      <ChatHeader
        partnerName={partnerName}
        partnerAvatar={partnerAvatar}
        isOnline={isOnline}
        reservationId={reservationId}
        backHref={backHref}
      />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50"
      >
        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-3">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-sm">대화를 시작해보세요!</p>
            <p className="text-xs mt-1">메시지를 입력하여 대화를 시작합니다.</p>
          </div>
        )}

        {renderMessages()}

        {/* Typing indicator */}
        {partnerTyping && (
          <div className="flex items-center gap-2 pl-10">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2.5">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400">상대방이 입력중...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
}
