
import {  IUser } from '@/types/types.ts';
import { instance } from '@/api/axios.api.ts';

export const becomeFarmer = async ():Promise<IUser> => {
	const { data } = await instance.put<IUser>('/users/become-farmer');
	return data;
};
