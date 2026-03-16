'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  id: string;
  type: 'sent' | 'received' | 'system';
  content: string;
  time: string;
}

const mockMessages: Message[] = [
  { id: 'm1', type: 'system', content: '채팅이 시작되었습니다.', time: '오후 1:00' },
  { id: 'm2', type: 'received', content: '안녕하세요, 3월 20일 강원도 속초 운행 관련하여 문의드립니다.', time: '오후 1:05' },
  { id: 'm3', type: 'sent', content: '네, 안녕하세요! 어떤 부분이 궁금하신가요?', time: '오후 1:06' },
  { id: 'm4', type: 'received', content: '출발 시간을 8시에서 7시 30분으로 변경할 수 있을까요?', time: '오후 1:08' },
  { id: 'm5', type: 'sent', content: '네, 가능합니다. 7시 30분으로 변경해드리겠습니다.', time: '오후 1:10' },
  { id: 'm6', type: 'received', content: '감사합니다! 그리고 중간에 휴게소 한 번 들러주실 수 있나요?', time: '오후 1:12' },
  { id: 'm7', type: 'sent', content: '물론이죠. 용인 휴게소에서 15분 정도 정차 예정입니다.', time: '오후 1:15' },
  { id: 'm8', type: 'system', content: '운행 일시: 2026-03-20 07:30', time: '오후 1:16' },
];

export default function ChatConversationPage() {
  const params = useParams();
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');

  const partnerName = '김민수';

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      type: 'sent',
      content: input.trim(),
      time: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-200 bg-white">
        <Link href="/chat" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-[#1B6FF4] flex items-center justify-center text-white font-bold text-sm">
          {partnerName.charAt(0)}
        </div>
        <h2 className="font-semibold text-gray-900">{partnerName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
        {messages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="text-center">
                <span className="inline-block px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          const isSent = msg.type === 'sent';
          return (
            <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isSent ? 'order-1' : ''}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isSent
                      ? 'bg-[#1B6FF4] text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
                <p className={`text-xs text-gray-400 mt-1 ${isSent ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1B6FF4] focus:outline-none focus:ring-2 focus:ring-[#1B6FF4]/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-[#1B6FF4] text-white flex items-center justify-center hover:bg-[#0B4FCC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
