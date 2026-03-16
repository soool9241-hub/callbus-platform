'use client';

import { useState } from 'react';
import {
  Search,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Truck,
  Phone,
  Building2,
  CreditCard,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TabList, Tab } from '@/components/ui/Tabs';

type ApprovalStatus = '대기' | '승인' | '거절';

interface DriverData {
  id: number;
  name: string;
  company: string;
  phone: string;
  rating: number;
  tripCount: number;
  approvalStatus: ApprovalStatus;
  license: string;
  vehicles: { type: string; plate: string; year: number }[];
  revenue: number;
}

const mockCustomers = [
  { id: 1, name: '김철수', phone: '010-1234-5678', email: 'kim@example.com', joinDate: '2025-11-20', status: '활성' as const, quoteCount: 12 },
  { id: 2, name: '이영희', phone: '010-2345-6789', email: 'lee@example.com', joinDate: '2025-12-05', status: '활성' as const, quoteCount: 8 },
  { id: 3, name: '박민수', phone: '010-3456-7890', email: 'park@example.com', joinDate: '2026-01-10', status: '정지' as const, quoteCount: 3 },
  { id: 4, name: '최지은', phone: '010-4567-8901', email: 'choi@example.com', joinDate: '2026-02-14', status: '활성' as const, quoteCount: 5 },
  { id: 5, name: '정우성', phone: '010-5678-9012', email: 'jung@example.com', joinDate: '2026-03-01', status: '활성' as const, quoteCount: 2 },
];

const mockDrivers: DriverData[] = [
  {
    id: 1, name: '한승우', company: '대한관광', phone: '010-1111-2222', rating: 4.8, tripCount: 156,
    approvalStatus: '승인', license: '대형 1종 보통',
    vehicles: [
      { type: '45인승 대형', plate: '서울 12바 3456', year: 2023 },
      { type: '28인승 중형', plate: '서울 34사 5678', year: 2024 },
    ],
    revenue: 45600000,
  },
  {
    id: 2, name: '오지훈', company: '서울고속', phone: '010-3333-4444', rating: 4.5, tripCount: 89,
    approvalStatus: '대기', license: '대형 1종 보통',
    vehicles: [{ type: '45인승 대형', plate: '경기 56아 7890', year: 2022 }],
    revenue: 23100000,
  },
  {
    id: 3, name: '윤서현', company: '코리아버스', phone: '010-5555-6666', rating: 4.9, tripCount: 234,
    approvalStatus: '승인', license: '대형 1종 보통',
    vehicles: [{ type: '45인승 대형', plate: '인천 78자 1234', year: 2024 }],
    revenue: 67800000,
  },
];

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState('customers');
  const [search, setSearch] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<DriverData[]>(mockDrivers);

  const filteredCustomers = mockCustomers.filter(
    (c) => c.name.includes(search) || c.phone.includes(search)
  );

  const filteredDrivers = drivers.filter(
    (d) => d.name.includes(search) || d.phone.includes(search) || d.company.includes(search)
  );

  const openDriverDetail = (driver: DriverData) => {
    setSelectedDriver(driver);
    setDriverModalOpen(true);
  };

  const handleApproveDriver = (id: number) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, approvalStatus: '승인' as ApprovalStatus } : d))
    );
    setDriverModalOpen(false);
  };

  const handleRejectDriver = (id: number) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, approvalStatus: '거절' as ApprovalStatus } : d))
    );
    setDriverModalOpen(false);
  };

  const formatCurrency = (amount: number) =>
    '\u20A9' + amount.toLocaleString('ko-KR');

  const approvalBadge: Record<string, 'warning' | 'success' | 'danger'> = {
    '대기': 'warning',
    '승인': 'success',
    '거절': 'danger',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p className="mt-1 text-sm text-gray-500">고객 및 기사 회원을 관리합니다.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabList activeValue={activeTab} onChange={setActiveTab}>
          <Tab value="customers">고객</Tab>
          <Tab value="drivers">기사</Tab>
        </TabList>
        <div className="w-full sm:w-72">
          <Input
            placeholder="이름, 전화번호 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefixIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {activeTab === 'customers' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">이름</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">전화번호</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">이메일</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">가입일</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">견적요청수</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{c.phone}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{c.email}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-500">{c.joinDate}</td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge variant={c.status === '활성' ? 'success' : 'danger'} size="sm" dot>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{c.quoteCount}건</td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3.5 w-3.5" />
                          상세
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Ban className="h-3.5 w-3.5" />
                          {c.status === '활성' ? '정지' : '해제'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'drivers' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">이름</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">회사명</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">전화번호</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">평점</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">운행수</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">승인상태</th>
                  <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDrivers.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{d.name}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{d.company}</td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{d.phone}</td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-700">{d.rating}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-700">{d.tripCount}회</td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <Badge variant={approvalBadge[d.approvalStatus]} size="sm" dot>
                        {d.approvalStatus}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openDriverDetail(d)}>
                          <Eye className="h-3.5 w-3.5" />
                          상세
                        </Button>
                        {d.approvalStatus === '대기' && (
                          <>
                            <Button size="sm" variant="primary" onClick={() => handleApproveDriver(d.id)}>
                              승인
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleRejectDriver(d.id)}>
                              거절
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={driverModalOpen}
        onClose={() => setDriverModalOpen(false)}
        title="기사 상세 정보"
        size="lg"
        footer={
          selectedDriver?.approvalStatus === '대기' ? (
            <>
              <Button variant="danger" onClick={() => selectedDriver && handleRejectDriver(selectedDriver.id)}>
                <XCircle className="h-4 w-4" />
                거절
              </Button>
              <Button variant="primary" onClick={() => selectedDriver && handleApproveDriver(selectedDriver.id)}>
                <CheckCircle className="h-4 w-4" />
                승인
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setDriverModalOpen(false)}>
              닫기
            </Button>
          )
        }
      >
        {selectedDriver && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">기본 정보</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    {selectedDriver.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedDriver.name}</p>
                    <Badge variant={approvalBadge[selectedDriver.approvalStatus]} size="sm" dot>
                      {selectedDriver.approvalStatus}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {selectedDriver.company}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {selectedDriver.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    {selectedDriver.license}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">보유 차량</h3>
              <div className="space-y-2">
                {selectedDriver.vehicles.map((v, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <Truck className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{v.type}</p>
                      <p className="text-xs text-gray-500">{v.plate} / {v.year}년식</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">운행 실적</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedDriver.tripCount}</p>
                  <p className="text-xs text-blue-500">총 운행</p>
                </div>
                <div className="rounded-lg bg-yellow-50 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{selectedDriver.rating}</p>
                  <p className="text-xs text-yellow-500">평균 평점</p>
                </div>
                <div className="rounded-lg bg-green-50 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedDriver.revenue)}</p>
                  <p className="text-xs text-green-500">총 매출</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
