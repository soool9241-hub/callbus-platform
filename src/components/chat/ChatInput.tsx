'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Send,
  Plus,
  Image as ImageIcon,
  FileText,
  MapPin,
  X,
} from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string, type?: 'text' | 'image' | 'file' | 'location') => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  maxLength?: number;
}

export function ChatInput({
  onSend,
  onTyping,
  disabled = false,
  maxLength = 1000,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canSend = text.trim().length > 0 || imagePreview !== null;
  const charCount = text.length;
  const showCharCount = charCount > maxLength * 0.8;

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const maxH = 120; // max ~5 lines
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxH)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [text, adjustHeight]);

  // Typing indicator
  const handleTypingChange = useCallback(
    (isTyping: boolean) => {
      if (!onTyping) return;
      onTyping(isTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 3000);
      }
    },
    [onTyping]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= maxLength) {
      setText(val);
      handleTypingChange(val.length > 0);
    }
  };

  const handleSend = () => {
    if (imagePreview) {
      onSend(text.trim() || '이미지를 전송했습니다.', 'image');
      setImagePreview(null);
      setText('');
      handleTypingChange(false);
      return;
    }

    if (!text.trim()) return;
    onSend(text.trim(), 'text');
    setText('');
    handleTypingChange(false);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        handleSend();
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setShowAttachMenu(false);
    // Reset input
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSend(file.name, 'file');
    setShowAttachMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLocationSend = () => {
    onSend('현재 위치를 공유했습니다.', 'location');
    setShowAttachMenu(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Image preview */}
      {imagePreview && (
        <div className="px-4 pt-3">
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="미리보기"
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
            <button
              onClick={() => {
                setImagePreview(null);
                URL.revokeObjectURL(imagePreview);
              }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3">
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                showAttachMenu
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              aria-label="파일 첨부"
            >
              <Plus className={`w-5 h-5 transition-transform ${showAttachMenu ? 'rotate-45' : ''}`} />
            </button>

            {/* Attachment menu */}
            {showAttachMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAttachMenu(false)}
                />
                <div className="absolute bottom-12 left-0 z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px]">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-[#1B6FF4]" />
                    </div>
                    사진
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#FF6B35]" />
                    </div>
                    파일
                  </button>
                  <button
                    onClick={handleLocationSend}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#10B981]" />
                    </div>
                    위치
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요"
              disabled={disabled}
              rows={1}
              className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-2.5 text-sm leading-relaxed focus:outline-none focus:border-[#1B6FF4] focus:ring-2 focus:ring-[#1B6FF4]/20 disabled:bg-gray-50 disabled:text-gray-400 placeholder:text-gray-400"
              style={{ minHeight: '44px' }}
            />
            {showCharCount && (
              <span
                className={`absolute right-3 bottom-1.5 text-[10px] ${
                  charCount >= maxLength ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend || disabled}
            className="w-10 h-10 rounded-full bg-[#1B6FF4] text-white flex items-center justify-center hover:bg-[#0B4FCC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            aria-label="전송"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
