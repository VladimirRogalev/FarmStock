import { ILoginDto, IResponseUser, IResponseUserData, IUserData } from '@/types/types.ts';
import { instance } from '@/api/axios.api.ts';

export const AuthService = {
	async register(userData: IUserData): Promise<IResponseUserData | undefined> {
		const { data } = await instance.post<IResponseUserData>('/auth/register', userData);
		return data;
	},
	async login(userData: ILoginDto): Promise<IResponseUserData | undefined> {
		const { data } = await instance.post<IResponseUserData>('/auth/login', userData);
		return data;
	},
	async getMe(): Promise<IResponseUser | undefined> {
		const { data } = await instance.get<IResponseUser>('/users/profile');
		return data;
	}
};
