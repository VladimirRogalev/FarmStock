import { IUser, UpdateUserDto } from '@/types/types.ts';
import { instance } from '@/api/axios.api.ts';

export const becomeFarmer = async (): Promise<IUser> => {
	const { data } = await instance.put<IUser>('/users/become-farmer');
	return data;
};

export const updateUserProfile = async (dto: UpdateUserDto): Promise<IUser> => {
	const { data } = await instance.put<IUser>('/users/profile', dto);
	return data;
};

export const deleteUserAccount = async (): Promise<void> => {
	await instance.delete('/users/profile');
};