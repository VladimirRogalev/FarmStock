import axios from 'axios';
import * as process from 'node:process';
import { getTokenFromLocalStorage } from '@/helpers/localstorage.helper.ts';

export const instance = axios.create({
	baseURL: process.env.VITE_SERVER_URL,
	headers: {
		Authorization: `Bearer` + getTokenFromLocalStorage() || ''
	},
});