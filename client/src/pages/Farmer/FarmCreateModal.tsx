import { useState } from 'react';
import { FarmService } from '@/services/farm.service';
import FarmForm from './FarmForm';
import { IFarm } from '@/types/types';
import { toast } from 'react-toastify';

interface FarmCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (farm: IFarm) => void;
  initialFarm?: IFarm;
}

const initialFarmState: IFarm = {
  title: '',
  description: '',
  country: '',
  city: '',
  street: '',
  apartment: '',
  latitude: undefined,
  longitude: undefined,
  tags: '',
  coverImage: '',
  contactEmail: '',
  contactPhone: '',
  website: '',
};

const FarmCreateModal = ({ open, onClose, onCreated, initialFarm }: FarmCreateModalProps) => {
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleCreate = async (farm: IFarm) => {
    setSaving(true);
    try {
      const newFarm = await FarmService.createFarm(farm);
      onCreated(newFarm);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to create farm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Create Farm</h2>
        <FarmForm
          initialFarm={initialFarm || initialFarmState}
          onSubmit={handleCreate}
          onCancel={onClose}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default FarmCreateModal; 