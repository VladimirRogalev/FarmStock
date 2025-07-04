import { instance } from '@/api/axios.api';
import { IFarm } from '@/types/types';

function cleanFarmPayload(farm: Partial<IFarm>) {
  const payload: any = { ...farm };
  if (!payload.latitude) {
    delete payload.latitude;
  }
  if (!payload.longitude) {
    delete payload.longitude;
  }
  if (!payload.contactEmail) {
    delete payload.contactEmail;
  }
  if (!payload.website) {
    delete payload.website;
  }
  return payload;
}

export const FarmService = {
  async getMyFarm(): Promise<IFarm> {
    const { data } = await instance.get<IFarm>('/farm/by-owner');
    return data;
  },
  async createFarm(farm: Omit<IFarm, 'id'>): Promise<IFarm> {
    const { id, ...rest } = farm as IFarm;
    const payload = cleanFarmPayload(rest);
    const { data } = await instance.post<IFarm>('/farm', {
      ...payload,
      tags: payload.tags ? payload.tags.split(',').map((t: string) => t.trim()) : [],
    });
    return data;
  },
  async updateFarm(farm: IFarm): Promise<IFarm> {
    const payload = cleanFarmPayload(farm);
    const { data } = await instance.put<IFarm>(`/farm/${farm.id}`, {
      ...payload,
      tags: payload.tags ? payload.tags.split(',').map((t: string) => t.trim()) : [],
    });
    return data;
  },
  async deleteFarm(id: string): Promise<void> {
    await instance.delete(`/farm/${id}`);
  },
}; 