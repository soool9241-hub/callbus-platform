'use client';

import { useState, useEffect } from 'react';
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
import { Spinner } from '@/components/ui/Spinner';
import { TabList, Tab } from '@/components/ui/Tabs';
import { supabase } from '@/lib/supabase';

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
  is_active: boolean;
  quoteCount: number;
}

interface VehicleInfo {
  vehicle_type: string;
  plate_number: string;
  year: number;
  vehicle_name: string;
}

interface DriverData {
  id: string;
  user_id: string;
  name: string;
  company_name: string;
  phone: string;
  rating: number;
  total_trips: number;
  approval_status: string;
  license_type: string;
  vehicles: VehicleInfo[];
}

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState('customers');
  const [search, setSearch] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [customersRes, driversRes] = await Promise.all([
        // Fetch customers (profiles with role = 'customer')
        supabase
          .from('profiles')
          .select('*')
          .eq('role', 'customer')
          .order('created_at', { ascending: false }),
        // Fetch drivers with profile and vehicle joins
        supabase
          .from('drivers')
          .select('*, profiles!user_id(name, phone, email), vehicles(*)')
          .order('created_at', { ascending: false }),
      ]);

      // Process customers - count quote_requests for each
      const customerProfiles = customersRes.data ?? [];
      const customerIds = customerProfiles.map((c: any) => c.id);

      let quoteCounts: Record<string, number> = {};
      if (customerIds.length > 0) {
        const { data: quoteData } = await supabase
          .from('quote_requests')
          .select('customer_id')
          .in('customer_id', customerIds);
        if (quoteData) {
          quoteData.forEach((q: any) => {
            quoteCounts[q.customer_id] = (quoteCounts[q.customer_id] || 0) + 1;
          });
        }
      }

      setCustomers(
        customerProfiles.map((c: any) => ({
          id: c.id,
          name: c.name || '-',
          phone: c.phone || '-',
          email: c.email || '-',
          created_at: c.created_at,
          is_active: c.is_active ?? true,
          quoteCount: quoteCounts[c.id] || 0,
        }))
      );

      // Process drivers
      setDrivers(
        (driversRes.data ?? []).map((d: any) => ({
          id: d.id,
          user_id: d.user_id,
          name: d.profiles?.name || '-',
          company_name: d.company_name || '-',
          phone: d.profiles?.phone || '-',
          rating: d.rating || 0,
          total_trips: d.total_trips || 0,
          approval_status: d.approval_status || 'pending',
          license_type: d.license_type || '-',
          vehicles: (d.vehicles ?? []).map((v: any) => ({
            vehicle_type: v.vehicle_type || '-',
            plate_number: v.plate_number || '-',
            year: v.year || 0,
            vehicle_name: v.vehicle_name || '-',
          })),
        }))
      );
    } catch (err) {
      console.error('Members fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = customers.filter(
    (c) => c.name.includes(search) || c.phone.includes(search)
  );

  const filteredDrivers = drivers.filter(
    (d) => d.name.includes(search) || d.phone.includes(search) || d.company_name.includes(search)
  );

  const openDriverDetail = (driver: DriverData) => {
    setSelectedDriver(driver);
    setDriverModalOpen(true);
  };

  const handleApproveDriver = async (id: string) => {
    setApproving(id);
    try {
      await supabase.from('drivers').update({ approval_status: 'approved' }).eq('id', id);
      setDrivers((prev) =>
        prev.map((d) => (d.id === id ? { ...d, approval_status: 'approved' } : d))
      );
      setDriverModalOpen(false);
    } catch (err) {
      console.error('Approve error:', err);
    } finally {
      setApproving(null);
    }
  };

  const handleRejectDriver = async (id: string) => {
    setApproving(id);
    try {
      await supabase.from('drivers').update({ approval_status: 'rejected' }).eq('id', id);
      setDrivers((prev) =>
        prev.map((d) => (d.id === id ? { ...d, approval_status: 'rejected' } : d))
      );
      setDriverModalOpen(false);
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setApproving(null);
    }
  };

  const approvalBadge: Record<string, 'warning' | 'success' | 'danger'> = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger',
  };

  const approvalLabel: Record<string, string> = {
    'pending': '대기',
    'approved': '승인',
    'rejected': '거절',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

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
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      데이터가 없습니다
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{c.phone}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{c.email}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500">
                        {new Date(c.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <Badge variant={c.is_active ? 'success' : 'danger'} size="sm" dot>
                          {c.is_active ? '활성' : '정지'}
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
                            {c.is_active ? '정지' : '해제'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      데이터가 없습니다
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900">{d.name}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{d.company_name}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{d.phone}</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-700">{d.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{d.total_trips}회</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <Badge variant={approvalBadge[d.approval_status] || 'default'} size="sm" dot>
                          {approvalLabel[d.approval_status] || d.approval_status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openDriverDetail(d)}>
                            <Eye className="h-3.5 w-3.5" />
                            상세
                          </Button>
                          {d.approval_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleApproveDriver(d.id)}
                                disabled={approving === d.id}
                              >
                                승인
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleRejectDriver(d.id)}
                                disabled={approving === d.id}
                              >
                                거절
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
          selectedDriver?.approval_status === 'pending' ? (
            <>
              <Button
                variant="danger"
                onClick={() => selectedDriver && handleRejectDriver(selectedDriver.id)}
                disabled={approving === selectedDriver?.id}
              >
                <XCircle className="h-4 w-4" />
                거절
              </Button>
              <Button
                variant="primary"
                onClick={() => selectedDriver && handleApproveDriver(selectedDriver.id)}
                disabled={approving === selectedDriver?.id}
              >
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
                    <Badge variant={approvalBadge[selectedDriver.approval_status] || 'default'} size="sm" dot>
                      {approvalLabel[selectedDriver.approval_status] || selectedDriver.approval_status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {selectedDriver.company_name}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {selectedDriver.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    {selectedDriver.license_type}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">보유 차량</h3>
              <div className="space-y-2">
                {selectedDriver.vehicles.length === 0 ? (
                  <p className="text-sm text-gray-400">등록된 차량이 없습니다.</p>
                ) : (
                  selectedDriver.vehicles.map((v, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                      <Truck className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{v.vehicle_name || v.vehicle_type}</p>
                        <p className="text-xs text-gray-500">{v.plate_number} / {v.year}년식</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">운행 실적</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-blue-50 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedDriver.total_trips}</p>
                  <p className="text-xs text-blue-500">총 운행</p>
                </div>
                <div className="rounded-lg bg-yellow-50 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{selectedDriver.rating.toFixed(1)}</p>
                  <p className="text-xs text-yellow-500">평균 평점</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
