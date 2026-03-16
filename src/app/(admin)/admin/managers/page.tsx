'use client';

import { useState } from 'react';
import { UserCheck, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Manager {
  id: string;
  name: string;
  activeCount: number;
  completedCount: number;
}

interface Assignment {
  id: string;
  reservationNo: string;
  customer: string;
  amount: number;
  managerId: string;
  managerName: string;
  assignedDate: string;
  status: 'active' | 'completed';
}

const mockManagers: Manager[] = [
  { id: 'm1', name: '매니저A (김지원)', activeCount: 3, completedCount: 42 },
  { id: 'm2', name: '매니저B (박소연)', activeCount: 2, completedCount: 38 },
  { id: 'm3', name: '매니저C (이도현)', activeCount: 2, completedCount: 27 },
  { id: 'm4', name: '매니저D (최유진)', activeCount: 1, completedCount: 15 },
];

const mockAssignments: Assignment[] = [
  { id: '1', reservationNo: 'RSV-2026-1042', customer: '김철수', amount: 850000, managerId: 'm1', managerName: '매니저A (김지원)', assignedDate: '2026-03-17', status: 'active' },
  { id: '2', reservationNo: 'RSV-2026-1043', customer: '이영미', amount: 1200000, managerId: 'm1', managerName: '매니저A (김지원)', assignedDate: '2026-03-16', status: 'active' },
  { id: '3', reservationNo: 'RSV-2026-1038', customer: '최민호', amount: 950000, managerId: 'm2', managerName: '매니저B (박소연)', assignedDate: '2026-03-15', status: 'active' },
  { id: '4', reservationNo: 'RSV-2026-1039', customer: '정수현', amount: 650000, managerId: 'm2', managerName: '매니저B (박소연)', assignedDate: '2026-03-14', status: 'active' },
  { id: '5', reservationNo: 'RSV-2026-1035', customer: '윤서준', amount: 1500000, managerId: 'm3', managerName: '매니저C (이도현)', assignedDate: '2026-03-13', status: 'active' },
  { id: '6', reservationNo: 'RSV-2026-1036', customer: '강예진', amount: 780000, managerId: 'm3', managerName: '매니저C (이도현)', assignedDate: '2026-03-12', status: 'active' },
  { id: '7', reservationNo: 'RSV-2026-1030', customer: '임도현', amount: 520000, managerId: 'm4', managerName: '매니저D (최유진)', assignedDate: '2026-03-11', status: 'active' },
  { id: '8', reservationNo: 'RSV-2026-1020', customer: '송하늘', amount: 600000, managerId: 'm1', managerName: '매니저A (김지원)', assignedDate: '2026-03-10', status: 'completed' },
];

export default function ManagersPage() {
  const [managers] = useState<Manager[]>(mockManagers);
  const [assignments] = useState<Assignment[]>(mockAssignments);

  const activeAssignments = assignments.filter((a) => a.status === 'active');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">매니저 배정</h1>
        <p className="mt-1 text-sm text-gray-500">전담 매니저를 배정하고 관리합니다.</p>
      </div>

      {/* Auto-assignment rule */}
      <Card padding="md" className="border-[#1B6FF4] bg-blue-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#1B6FF4] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">자동 배정 규칙</p>
            <p className="text-sm text-gray-600">50만원 이상 건은 전담 매니저가 자동 배정됩니다. 현재 라운드 로빈 방식으로 균등 배분 중입니다.</p>
          </div>
        </div>
      </Card>

      {/* Manager summary */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">매니저 현황</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {managers.map((m) => (
            <Card key={m.id} padding="md" hover>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#1B6FF4] font-bold text-sm">
                  {m.name[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-500">활성 <span className="font-bold text-[#1B6FF4]">{m.activeCount}</span></span>
                    <span className="text-xs text-gray-500">완료 <span className="font-bold text-[#10B981]">{m.completedCount}</span></span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Active assignments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">활성 배정 현황</h2>

        {/* Desktop table */}
        <Card padding="none" className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">예약번호</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">고객</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">금액</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">담당 매니저</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">배정일</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <UserCheck className="mx-auto mb-2 h-8 w-8" />
                      활성 배정이 없습니다
                    </td>
                  </tr>
                ) : (
                  activeAssignments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3 font-mono text-sm font-medium text-gray-900">{a.reservationNo}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{a.customer}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                        <span className={a.amount >= 500000 ? 'font-bold text-[#1B6FF4]' : ''}>
                          {a.amount.toLocaleString()}원
                        </span>
                        {a.amount >= 500000 && (
                          <Badge variant="info" size="sm" className="ml-2">자동배정</Badge>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{a.managerName}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500">{a.assignedDate}</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <Badge variant={a.status === 'active' ? 'info' : 'success'} size="sm" dot>
                          {a.status === 'active' ? '진행중' : '완료'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mobile card list */}
        <div className="md:hidden space-y-3">
          {activeAssignments.map((a) => (
            <Card key={a.id} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-xs text-gray-400">{a.reservationNo}</p>
                  <p className="font-medium text-gray-900">{a.customer}</p>
                </div>
                <Badge variant="info" size="sm" dot>진행중</Badge>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`font-medium ${a.amount >= 500000 ? 'text-[#1B6FF4]' : 'text-gray-900'}`}>
                  {a.amount.toLocaleString()}원
                  {a.amount >= 500000 && (
                    <Badge variant="info" size="sm" className="ml-2">자동</Badge>
                  )}
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span>{a.managerName}</span>
                <span>{a.assignedDate}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
