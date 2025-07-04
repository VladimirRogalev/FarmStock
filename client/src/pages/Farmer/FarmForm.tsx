import { IFarm } from '@/types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { farmCreateSchema, farmEditSchema, FarmCreateSchema, FarmEditSchema } from '@/schemas/farmFormSchema';

interface FarmFormProps {
  initialFarm?: IFarm;
  onSubmit: (farm: IFarm) => void;
  onCancel?: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const initialFarmState: IFarm = {
  title: '',
  description: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  tags: '',
  coverImage: '',
  contactEmail: '',
  contactPhone: '',
  website: '',
};

export default function FarmForm({ initialFarm, onSubmit, onCancel, loading, mode = 'create' }: FarmFormProps) {
  const schema = mode === 'edit' ? farmEditSchema : farmCreateSchema;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FarmCreateSchema | FarmEditSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialFarm || initialFarmState,
  });

  const handleGetLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setValue('latitude', pos.coords.latitude);
          setValue('longitude', pos.coords.longitude);
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
            );
            const data = await response.json();
            if (data.display_name) {
              setValue('address', data.display_name);
            }
          } catch {}
        },
        () => {}
      );
    }
  };

  const onFormSubmit = (data: any) => {
    const id = initialFarm?.id;
    onSubmit({ ...(data as IFarm), id } as IFarm);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Title</label>
        <input {...register('title')} className="input w-full" placeholder="Farm title" />
        {errors.title && <div className="text-red-500 text-sm">{errors.title.message}</div>}
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea {...register('description')} className="input w-full" placeholder="Farm description" />
      </div>
      <div>
        <label className="block font-medium">Address</label>
        <input {...register('address')} className="input w-full" placeholder="Farm address" />
        {errors.address && <div className="text-red-500 text-sm">{errors.address.message}</div>}
      </div>
      <div>
        <label className="block font-medium">Latitude</label>
        <input type="number" step="any" {...register('latitude', { valueAsNumber: true })} className="input w-full" placeholder="e.g. 32.12345" />
        {errors.latitude && <div className="text-red-500 text-sm">{errors.latitude.message}</div>}
      </div>
      <div>
        <label className="block font-medium">Longitude</label>
        <input type="number" step="any" {...register('longitude', { valueAsNumber: true })} className="input w-full" placeholder="e.g. 34.98765" />
        {errors.longitude && <div className="text-red-500 text-sm">{errors.longitude.message}</div>}
      </div>
      <div className="flex gap-2 items-center">
        <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" onClick={handleGetLocation}>
          Get my location
        </button>
      </div>
      <div>
        <label className="block font-medium">Tags (comma separated)</label>
        <input {...register('tags')} className="input w-full" placeholder="eco, organic, ..." />
      </div>
      <div>
        <label className="block font-medium">Cover Image URL</label>
        <input {...register('coverImage')} className="input w-full" placeholder="https://..." />
      </div>
      <div>
        <label className="block font-medium">Contact Email</label>
        <input {...register('contactEmail')} className="input w-full" placeholder="farm@email.com" />
        {errors.contactEmail && <div className="text-red-500 text-sm">{errors.contactEmail.message}</div>}
      </div>
      <div>
        <label className="block font-medium">Contact Phone</label>
        <input {...register('contactPhone')} className="input w-full" placeholder="+972..." />
        {errors.contactPhone && <div className="text-red-500 text-sm">{errors.contactPhone.message}</div>}
      </div>
      <div>
        <label className="block font-medium">Website</label>
        <input {...register('website')} className="input w-full" placeholder="https://example.com" />
        {errors.website && <div className="text-red-500 text-sm">{errors.website.message}</div>}
      </div>
      <div className="flex gap-4 mt-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        {onCancel && (
          <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold transition" onClick={onCancel} disabled={loading}>Cancel</button>
        )}
      </div>
    </form>
  );
} 