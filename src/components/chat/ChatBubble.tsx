'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  MapPin,
  Copy,
  Trash2,
  X,
} from 'lucide-react';
import type { ChatMessage } from '@/lib/chat';
import { formatMessageTime } from '@/lib/chat';

interface ChatBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  showReadReceipt?: boolean;
}

export function ChatBubble({ message, isMine, showReadReceipt = false }: ChatBubbleProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const time = formatMessageTime(message.createdAt);

  // System message
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setShowContextMenu(false);
  };

  const bubbleColor = isMine
    ? 'bg-[#1B6FF4] text-white rounded-br-md'
    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md';

  return (
    <>
      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}>
        {/* Sender avatar for received messages */}
        {!isMine && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xs mr-2 mt-1 flex-shrink-0">
            {message.senderName.charAt(0)}
          </div>
        )}

        <div className={`max-w-[70%] relative ${isMine ? '' : ''}`}>
          {/* Sender name for received messages */}
          {!isMine && (
            <p className="text-xs text-gray-500 mb-1 ml-1">{message.senderName}</p>
          )}

          <div className={`flex items-end gap-1.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Bubble content */}
            <div
              className={`rounded-2xl overflow-hidden ${bubbleColor}`}
              onContextMenu={handleContextMenu}
            >
              {/* Text message */}
              {message.type === 'text' && (
                <div className="px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              )}

              {/* Image message */}
              {message.type === 'image' && (
                <div>
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  >
                    <div className="w-48 h-36 bg-gray-100 flex items-center justify-center">
                      {message.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={message.imageUrl}
                          alt="전송된 이미지"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">
                          <div className="w-12 h-12 mx-auto mb-1 bg-gray-200 rounded-lg flex items-center justify-center">
                            📷
                          </div>
                          <span>이미지</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {message.content && (
                    <div className="px-4 py-2 text-sm">{message.content}</div>
                  )}
                </div>
              )}

              {/* File message */}
              {message.type === 'file' && (
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isMine ? 'bg-white/20' : 'bg-blue-50'
                  }`}>
                    <FileText className={`w-5 h-5 ${isMine ? 'text-white' : 'text-[#1B6FF4]'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {message.fileName || '파일'}
                    </p>
                    <p className={`text-xs mt-0.5 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                      파일 첨부
                    </p>
                  </div>
                  <button className={`p-1.5 rounded-lg flex-shrink-0 ${
                    isMine ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}>
                    <Download className={`w-4 h-4 ${isMine ? 'text-white' : 'text-gray-500'}`} />
                  </button>
                </div>
              )}

              {/* Location message */}
              {message.type === 'location' && (
                <div>
                  <div className="w-48 h-28 bg-gray-100 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-[#FF6B35]" />
                    </div>
                  </div>
                  <div className="px-4 py-2.5">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <MapPin className={`w-3.5 h-3.5 ${isMine ? 'text-blue-200' : 'text-[#FF6B35]'}`} />
                      {message.locationLabel || message.content || '위치'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Time and read receipt */}
            <div className={`flex flex-col items-${isMine ? 'end' : 'start'} gap-0.5 flex-shrink-0 pb-0.5`}>
              {isMine && showReadReceipt && message.isRead && (
                <span className="text-[10px] text-[#1B6FF4] font-medium">읽음</span>
              )}
              <span className="text-[10px] text-gray-400">{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowContextMenu(false)}
        >
          <div
            className="absolute bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[140px]"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Copy className="w-4 h-4" />
              복사하기
            </button>
            <button
              onClick={() => setShowContextMenu(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              삭제하기
            </button>
          </div>
        </div>
      )}

      {/* Image modal */}
      {showImageModal && message.type === 'image' && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full"
            onClick={() => setShowImageModal(false)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-full max-h-full">
            {message.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={message.imageUrl}
                alt="이미지 확대"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            ) : (
              <div className="bg-gray-800 rounded-lg p-12 text-gray-400 text-center">
                이미지를 불러올 수 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
