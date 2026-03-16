'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';

type Message = {
  id: string;
  type: 'sent' | 'received' | 'system';
  text: string;
  time: string;
};

const partnerName = '박정훈 기사님';

const initialMessages: Message[] = [
  { id: '1', type: 'system', text: '채팅이 시작되었습니다.', time: '' },
  { id: '2', type: 'received', text: '안녕하세요, 박정훈 기사입니다. 견적 요청 확인했습니다.', time: '오후 2:30' },
  { id: '3', type: 'sent', text: '안녕하세요! 4월 15일 속초 여행 건 문의드립니다.', time: '오후 2:31' },
  { id: '4', type: 'received', text: '네, 45인승 대형버스로 서울 강남 출발 속초 도착이죠?', time: '오후 2:32' },
  { id: '5', type: 'sent', text: '맞습니다. 인원은 35명이고, 왕복으로 부탁드립니다.', time: '오후 2:33' },
  { id: '6', type: 'received', text: '견적서 보내드리겠습니다. 잠시만 기다려주세요.', time: '오후 2:34' },
  { id: '7', type: 'system', text: '견적서가 전송되었습니다.', time: '' },
  { id: '8', type: 'received', text: '견적서 확인해주시고, 궁금한 점 있으면 편하게 말씀해주세요!', time: '오후 2:40' },
];

export default function ChatConversationPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      type: 'sent',
      text: input.trim(),
      time: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => router.back()}
          className="p-1 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
          박
        </div>
        <span className="font-medium text-gray-900">{partnerName}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="text-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isSent = msg.type === 'sent';
          return (
            <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isSent ? 'order-2' : ''}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isSent
                      ? 'bg-[#1B6FF4] text-white rounded-br-md'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  {msg.text}
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
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B6FF4] focus:ring-2 focus:ring-[#1B6FF4]/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-[#1B6FF4] text-white flex items-center justify-center hover:bg-[#0B4FCC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
