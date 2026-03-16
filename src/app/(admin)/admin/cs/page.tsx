'use client';

import { useState } from 'react';
import { Headphones, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TabList, Tab } from '@/components/ui/Tabs';

interface Message {
  sender: 'customer' | 'manager';
  text: string;
  time: string;
}

interface Ticket {
  id: string;
  ticketNo: string;
  customer: string;
  subject: string;
  category: '결제' | '예약' | '운행' | '기타';
  priority: '높음' | '중간' | '낮음';
  manager: string;
  status: 'waiting' | 'inProgress' | 'completed';
  date: string;
  messages: Message[];
}

const mockTickets: Ticket[] = [
  {
    id: '1', ticketNo: 'CS-2026-0301', customer: '김철수', subject: '결제 오류 문의', category: '결제', priority: '높음', manager: '매니저A', status: 'inProgress', date: '2026-03-17 14:00',
    messages: [
      { sender: 'customer', text: '결제가 두 번 됐습니다. 확인 부탁드립니다.', time: '14:00' },
      { sender: 'manager', text: '확인 중입니다. 잠시만 기다려주세요.', time: '14:05' },
      { sender: 'manager', text: '중복 결제 확인되었습니다. 환불 처리 진행하겠습니다.', time: '14:15' },
    ],
  },
  {
    id: '2', ticketNo: 'CS-2026-0302', customer: '이영미', subject: '예약 변경 요청', category: '예약', priority: '중간', manager: '미배정', status: 'waiting', date: '2026-03-17 11:30',
    messages: [
      { sender: 'customer', text: '3월 25일 예약을 3월 28일로 변경하고 싶습니다.', time: '11:30' },
    ],
  },
  {
    id: '3', ticketNo: 'CS-2026-0303', customer: '박지은', subject: '운행 중 사고 접수', category: '운행', priority: '높음', manager: '매니저B', status: 'inProgress', date: '2026-03-16 16:00',
    messages: [
      { sender: 'customer', text: '운행 중 경미한 접촉사고가 발생했습니다.', time: '16:00' },
      { sender: 'manager', text: '안전하신지요? 기사님과 상황 확인 후 연락드리겠습니다.', time: '16:10' },
    ],
  },
  {
    id: '4', ticketNo: 'CS-2026-0304', customer: '최민호', subject: '쿠폰 적용 안됨', category: '결제', priority: '낮음', manager: '매니저A', status: 'completed', date: '2026-03-15 10:00',
    messages: [
      { sender: 'customer', text: 'WELCOME10 쿠폰이 적용이 안됩니다.', time: '10:00' },
      { sender: 'manager', text: '최소 주문금액 10만원 이상이어야 적용 가능합니다.', time: '10:15' },
      { sender: 'customer', text: '아, 그렇군요. 감사합니다.', time: '10:20' },
    ],
  },
  {
    id: '5', ticketNo: 'CS-2026-0305', customer: '정수현', subject: '기사 불친절 신고', category: '운행', priority: '중간', manager: '미배정', status: 'waiting', date: '2026-03-15 09:00',
    messages: [
      { sender: 'customer', text: '기사님이 매우 불친절했습니다. 확인 부탁드립니다.', time: '09:00' },
    ],
  },
  {
    id: '6', ticketNo: 'CS-2026-0306', customer: '한지영', subject: '앱 로그인 오류', category: '기타', priority: '낮음', manager: '매니저C', status: 'completed', date: '2026-03-14 15:30',
    messages: [
      { sender: 'customer', text: '소셜 로그인이 안됩니다.', time: '15:30' },
      { sender: 'manager', text: '앱을 최신 버전으로 업데이트 후 재시도해주세요.', time: '15:40' },
      { sender: 'customer', text: '해결되었습니다. 감사합니다!', time: '16:00' },
    ],
  },
];

const statusConfig: Record<string, { variant: 'warning' | 'info' | 'success'; label: string }> = {
  waiting: { variant: 'warning', label: '대기중' },
  inProgress: { variant: 'info', label: '처리중' },
  completed: { variant: 'success', label: '완료' },
};

const priorityConfig: Record<string, { variant: 'danger' | 'warning' | 'default'; label: string }> = {
  '높음': { variant: 'danger', label: '높음' },
  '중간': { variant: 'warning', label: '중간' },
  '낮음': { variant: 'default', label: '낮음' },
};

const categoryBadge: Record<string, 'info' | 'success' | 'purple' | 'default'> = {
  '결제': 'info',
  '예약': 'success',
  '운행': 'purple',
  '기타': 'default',
};

export default function CSPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tickets] = useState<Ticket[]>(mockTickets);

  const filtered = tickets.filter((t) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'waiting') return t.status === 'waiting';
    if (activeTab === 'inProgress') return t.status === 'inProgress';
    if (activeTab === 'completed') return t.status === 'completed';
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CS 관리</h1>
        <p className="mt-1 text-sm text-gray-500">고객 문의를 관리하고 응대합니다.</p>
      </div>

      <TabList activeValue={activeTab} onChange={setActiveTab}>
        <Tab value="all">전체 ({tickets.length})</Tab>
        <Tab value="waiting">대기중 ({tickets.filter((t) => t.status === 'waiting').length})</Tab>
        <Tab value="inProgress">처리중 ({tickets.filter((t) => t.status === 'inProgress').length})</Tab>
        <Tab value="completed">완료 ({tickets.filter((t) => t.status === 'completed').length})</Tab>
      </TabList>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="w-8 px-3 py-3"></th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">티켓번호</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">고객</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">제목</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">카테고리</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">우선순위</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">담당자</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                    <Headphones className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const sc = statusConfig[t.status];
                  const pc = priorityConfig[t.priority];
                  const isExpanded = expandedId === t.id;
                  return (
                    <>
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleExpand(t.id)}
                      >
                        <td className="px-3 py-3 text-gray-400">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 font-mono text-sm font-medium text-gray-900">{t.ticketNo}</td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-700">{t.customer}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{t.subject}</td>
                        <td className="whitespace-nowrap px-6 py-3">
                          <Badge variant={categoryBadge[t.category]} size="sm">{t.category}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          <Badge variant={pc.variant} size="sm">{pc.label}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                          {t.manager === '미배정' ? (
                            <span className="text-orange-500">미배정</span>
                          ) : t.manager}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3">
                          <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-gray-500">{t.date}</td>
                      </tr>
                      {isExpanded && (
                        <tr key={t.id + '-thread'}>
                          <td colSpan={9} className="bg-gray-50 px-10 py-4">
                            <div className="space-y-3">
                              {t.messages.map((m, i) => (
                                <div
                                  key={i}
                                  className={`flex ${m.sender === 'manager' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-md rounded-lg px-4 py-2.5 text-sm ${
                                      m.sender === 'manager'
                                        ? 'bg-[#1B6FF4] text-white'
                                        : 'bg-white border border-gray-200 text-gray-800'
                                    }`}
                                  >
                                    <p>{m.text}</p>
                                    <p className={`mt-1 text-xs ${m.sender === 'manager' ? 'text-blue-100' : 'text-gray-400'}`}>
                                      {m.sender === 'manager' ? '매니저' : t.customer} / {m.time}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((t) => {
          const sc = statusConfig[t.status];
          const pc = priorityConfig[t.priority];
          const isExpanded = expandedId === t.id;
          return (
            <Card key={t.id} padding="none">
              <div
                className="cursor-pointer px-4 py-3"
                onClick={() => toggleExpand(t.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-gray-400">{t.ticketNo}</p>
                    <p className="font-medium text-gray-900">{t.subject}</p>
                    <p className="text-sm text-gray-500">{t.customer}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={sc.variant} size="sm" dot>{sc.label}</Badge>
                    <Badge variant={pc.variant} size="sm">{t.priority}</Badge>
                  </div>
                </div>
                <div className="mt-2 flex gap-3 text-xs text-gray-400">
                  <Badge variant={categoryBadge[t.category]} size="sm">{t.category}</Badge>
                  <span>{t.manager}</span>
                  <span>{t.date}</span>
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-2">
                  {t.messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.sender === 'manager' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          m.sender === 'manager'
                            ? 'bg-[#1B6FF4] text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{m.text}</p>
                        <p className={`mt-0.5 text-xs ${m.sender === 'manager' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {m.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
