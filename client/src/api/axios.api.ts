import axios from 'axios';
import { getTokenFromLocalStorage } from '@/helpers/localstorage.helper.ts';

export const instance = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URL,
	withCredentials: true,
});
instance.interceptors.request.use(config => {
	const token = getTokenFromLocalStorage();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});