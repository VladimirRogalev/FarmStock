import { IResponseUserData, IUserData } from '@/types/types.ts';
import { instance } from '@/api/axios.api.ts';

export const AuthService = {
	async register(userData: IUserData): Promise<IResponseUserData | undefined> {
		const {data} = await instance.post<IResponseUserData>('/auth/register', userData);
		return data
	},
	async login() {
	},
	async hetMe() {
	}
};