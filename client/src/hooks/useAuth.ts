import { useAppSelector } from '@/store/hooks.ts';

export const useAuth = () => {
	const user = useAppSelector((state) => state.user.user);
	const isAuth = useAppSelector((state) => state.user.isAuth);
	return { user, isAuth };
};