'use client';

import { useState, useEffect } from 'react';
import {
  Bus,
  Plus,
  Edit,
  Trash2,
  Wifi,
  Usb,
  Tv,
  Mic,
  Refrigerator,
  Monitor,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { mockVehicles } from '@/lib/mock-data';
import { VEHICLE_TYPES, VEHICLE_OPTIONS } from '@/types';
import type { Vehicle } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import {
  getDriverVehicles,
  getDriverByUserId,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '@/lib/supabase-db';

function getOptionIcon(option: string) {
  if (option.includes('Wi-Fi')) return Wifi;
  if (option.includes('USB')) return Usb;
  if (option.includes('TV') || option.includes('모니터')) return Monitor;
  if (option.includes('노래방')) return Mic;
  if (option.includes('냉장고')) return Refrigerator;
  return null;
}

export default function VehiclesPage() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { currentUser } = useStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [driverId, setDriverId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    async function fetchData() {
      if (isLoggedIn && currentUser) {
        try {
          const driverResult = await getDriverByUserId(currentUser.id);
          if (driverResult.data) {
            setDriverId(driverResult.data.id);
            const vehiclesResult = await getDriverVehicles(driverResult.data.id);
            if (vehiclesResult.data) {
              setVehicles(vehiclesResult.data as Vehicle[]);
            }
          }
        } catch (err) {
          console.error('차량 목록 로딩 실패:', err);
          setVehicles(mockVehicles);
        }
      } else {
        setVehicles(mockVehicles);
      }
      setLoading(false);
    }

    fetchData();
  }, [isLoggedIn, currentUser, authLoading]);

  // Form state
  const [formType, setFormType] = useState('');
  const [formName, setFormName] = useState('');
  const [formPlate, setFormPlate] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formSeats, setFormSeats] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>([]);

  const vehicleTypeOptions = VEHICLE_TYPES.map((v) => ({
    value: v.key,
    label: v.label,
  }));

  const resetForm = () => {
    setFormType('');
    setFormName('');
    setFormPlate('');
    setFormYear('');
    setFormSeats('');
    setFormOptions([]);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setFormType(vehicle.vehicle_type);
    setFormName(vehicle.vehicle_name);
    setFormPlate(vehicle.plate_number);
    setFormYear(String(vehicle.year));
    setFormSeats(String(vehicle.seats));
    setFormOptions(vehicle.options);
    setModalOpen(true);
  };

  const handleToggleActive = async (id: string) => {
    const vehicle = vehicles.find((v) => v.id === id);
    if (!vehicle) return;
    const newActive = !vehicle.is_active;
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, is_active: newActive } : v
      )
    );
    if (isLoggedIn) {
      try {
        await updateVehicle(id, { is_active: newActive });
      } catch (err) {
        console.error('차량 상태 변경 실패:', err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 이 차량을 삭제하시겠습니까?')) {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      if (isLoggedIn) {
        try {
          await deleteVehicle(id);
        } catch (err) {
          console.error('차량 삭제 실패:', err);
        }
      }
    }
  };

  const handleOptionToggle = (option: string) => {
    setFormOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSubmitForm = () => {
    if (editingId) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? {
                ...v,
                vehicle_type: formType as Vehicle['vehicle_type'],
                vehicle_name: formName,
                plate_number: formPlate,
                year: Number(formYear),
                seats: Number(formSeats),
                options: formOptions,
              }
            : v
        )
      );
    } else {
      const newVehicle: Vehicle = {
        id: `vehicle-${Date.now()}`,
        driver_id: 'driver-001',
        vehicle_type: formType as Vehicle['vehicle_type'],
        vehicle_name: formName,
        plate_number: formPlate,
        year: Number(formYear),
        seats: Number(formSeats),
        photos: [],
        options: formOptions,
        is_active: true,
      };
      setVehicles((prev) => [...prev, newVehicle]);
    }
    setModalOpen(false);
    resetForm();
  };

  const photoColors = ['bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100'];

  return (
    <div className="px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">차량 관리</h1>
        <Button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500"
        >
          <Plus className="w-4 h-4" />
          차량 등록
        </Button>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle, index) => (
          <Card key={vehicle.id} hover className="overflow-hidden">
            {/* Photo Placeholder */}
            <div
              className={`h-48 flex items-center justify-center ${
                photoColors[index % photoColors.length]
              } relative`}
            >
              <Bus className="w-20 h-20 text-gray-400 opacity-50" />
              {/* Active Status */}
              <div className="absolute top-3 right-3">
                <Badge
                  variant={vehicle.is_active ? 'success' : 'default'}
                  size="sm"
                  dot
                >
                  {vehicle.is_active ? '운행중' : '미운행'}
                </Badge>
              </div>
            </div>

            <div className="p-5">
              {/* Vehicle Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {vehicle.vehicle_name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{vehicle.plate_number}</p>

              {/* Year & Seats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{vehicle.year}년식</span>
                <span>{vehicle.seats}인승</span>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-2 mb-4">
                {vehicle.options.map((option) => {
                  const Icon = getOptionIcon(option);
                  return (
                    <Badge key={option} variant="info" size="sm">
                      {Icon && <Icon className="w-3 h-3 mr-0.5" />}
                      {option}
                    </Badge>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {/* Toggle */}
                <button
                  onClick={() => handleToggleActive(vehicle.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    vehicle.is_active ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      vehicle.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(vehicle)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    수정
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Registration / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingId ? '차량 수정' : '차량 등록'}
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmitForm}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 focus-visible:ring-green-500"
            >
              {editingId ? '수정 완료' : '등록하기'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="차량 종류"
            options={vehicleTypeOptions}
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            placeholder="차량 종류를 선택하세요"
          />

          <Input
            label="차량명"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="예: 현대 유니버스 럭셔리"
          />

          <Input
            label="차량 번호"
            value={formPlate}
            onChange={(e) => setFormPlate(e.target.value)}
            placeholder="예: 서울 72바 1234"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="연식"
              type="number"
              value={formYear}
              onChange={(e) => setFormYear(e.target.value)}
              placeholder="예: 2024"
            />
            <Input
              label="좌석 수"
              type="number"
              value={formSeats}
              onChange={(e) => setFormSeats(e.target.value)}
              placeholder="예: 45"
            />
          </div>

          {/* Options Multi-select */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              차량 옵션
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VEHICLE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    formOptions.includes(option)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formOptions.includes(option)}
                    onChange={() => handleOptionToggle(option)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Photo Upload Placeholder */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              차량 사진
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
              <Bus className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                클릭하여 사진을 업로드하세요
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG (최대 5MB)
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
