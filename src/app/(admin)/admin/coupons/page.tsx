'use client';

import { useState } from 'react';
import { Ticket, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';

interface Coupon {
  id: string;
  code: string;
  name: string;
  discountType: 'fixed' | 'percent';
  value: number;
  minOrder: number;
  maxDiscount: number;
  validFrom: string;
  validTo: string;
  usedCount: number;
  maxUsage: number;
  status: 'active' | 'inactive' | 'expired';
}

const mockCoupons: Coupon[] = [
  { id: '1', code: 'WELCOME10', name: '신규가입 10% 할인', discountType: 'percent', value: 10, minOrder: 100000, maxDiscount: 50000, validFrom: '2026-01-01', validTo: '2026-06-30', usedCount: 245, maxUsage: 1000, status: 'active' },
  { id: '2', code: 'SUMMER2026', name: '여름 시즌 할인', discountType: 'fixed', value: 30000, minOrder: 200000, maxDiscount: 30000, validFrom: '2026-06-01', validTo: '2026-08-31', usedCount: 0, maxUsage: 500, status: 'active' },
  { id: '3', code: 'PENSION5K', name: '펜션 예약 5천원 할인', discountType: 'fixed', value: 5000, minOrder: 50000, maxDiscount: 5000, validFrom: '2026-02-01', validTo: '2026-04-30', usedCount: 88, maxUsage: 200, status: 'active' },
  { id: '4', code: 'VIP20', name: 'VIP 고객 20% 할인', discountType: 'percent', value: 20, minOrder: 300000, maxDiscount: 100000, validFrom: '2026-01-01', validTo: '2026-12-31', usedCount: 15, maxUsage: 50, status: 'active' },
  { id: '5', code: 'NEWYEAR', name: '새해 특별 할인', discountType: 'fixed', value: 20000, minOrder: 150000, maxDiscount: 20000, validFrom: '2025-12-20', validTo: '2026-01-10', usedCount: 312, maxUsage: 300, status: 'expired' },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    name: '',
    discountType: 'fixed',
    value: '',
    minOrder: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    maxUsage: '',
  });

  const toggleStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'inactive' as const : 'active' as const }
          : c
      )
    );
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreate = () => {
    const newCoupon: Coupon = {
      id: String(Date.now()),
      code: form.code,
      name: form.name,
      discountType: form.discountType as 'fixed' | 'percent',
      value: Number(form.value),
      minOrder: Number(form.minOrder),
      maxDiscount: Number(form.maxDiscount),
      validFrom: form.validFrom,
      validTo: form.validTo,
      usedCount: 0,
      maxUsage: Number(form.maxUsage),
      status: 'active',
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setModalOpen(false);
    setForm({ code: '', name: '', discountType: 'fixed', value: '', minOrder: '', maxDiscount: '', validFrom: '', validTo: '', maxUsage: '' });
  };

  const formatDiscount = (c: Coupon) =>
    c.discountType === 'percent' ? `${c.value}%` : `${c.value.toLocaleString()}원`;

  const statusBadge: Record<string, { variant: 'success' | 'default' | 'danger'; label: string }> = {
    active: { variant: 'success', label: '활성' },
    inactive: { variant: 'default', label: '비활성' },
    expired: { variant: 'danger', label: '만료' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">쿠폰/프로모션</h1>
          <p className="mt-1 text-sm text-gray-500">쿠폰을 생성하고 관리합니다.</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />새 쿠폰 만들기
        </Button>
      </div>

      {/* Desktop table */}
      <Card padding="none" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">코드</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">쿠폰명</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">할인</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">사용현황</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">유효기간</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">상태</th>
                <th className="whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <Ticket className="mx-auto mb-2 h-8 w-8" />
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                coupons.map((c) => {
                  const sb = statusBadge[c.status];
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-3 font-mono font-medium text-gray-900">{c.code}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{c.name}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">{formatDiscount(c)}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-700">
                        {c.usedCount.toLocaleString()}/{c.maxUsage.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500">{c.validFrom} ~ {c.validTo}</td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <Badge variant={sb.variant} size="sm" dot>{sb.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        <div className="flex gap-1">
                          {c.status !== 'expired' && (
                            <Button size="sm" variant="ghost" onClick={() => toggleStatus(c.id)}>
                              {c.status === 'active' ? (
                                <><ToggleRight className="h-4 w-4 text-green-500" />비활성</>
                              ) : (
                                <><ToggleLeft className="h-4 w-4 text-gray-400" />활성</>
                              )}
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />삭제
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {coupons.map((c) => {
          const sb = statusBadge[c.status];
          return (
            <Card key={c.id} padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono font-medium text-gray-900">{c.code}</p>
                  <p className="text-sm text-gray-500">{c.name}</p>
                </div>
                <Badge variant={sb.variant} size="sm" dot>{sb.label}</Badge>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <span>{formatDiscount(c)}</span>
                <span>{c.usedCount}/{c.maxUsage}회</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{c.validFrom} ~ {c.validTo}</p>
              <div className="mt-3 flex gap-2">
                {c.status !== 'expired' && (
                  <Button size="sm" variant="ghost" onClick={() => toggleStatus(c.id)}>
                    {c.status === 'active' ? '비활성' : '활성'}
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create coupon modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="새 쿠폰 만들기"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>취소</Button>
            <Button variant="primary" onClick={handleCreate}>생성</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="쿠폰 코드" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="예: SUMMER2026" />
            <Input label="쿠폰명" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="쿠폰 이름" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="할인 유형"
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              options={[
                { value: 'fixed', label: '정액 할인' },
                { value: 'percent', label: '정률 할인 (%)' },
              ]}
            />
            <Input label="할인 값" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.discountType === 'percent' ? '예: 10' : '예: 5000'} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="최소 주문 금액" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} placeholder="0" />
            <Input label="최대 할인 금액" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="0" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="시작일" type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
            <Input label="종료일" type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
          </div>
          <Input label="최대 사용 횟수" type="number" value={form.maxUsage} onChange={(e) => setForm({ ...form, maxUsage: e.target.value })} placeholder="예: 1000" />
        </div>
      </Modal>
    </div>
  );
}
