import { FC, JSX } from 'react';
import { useAppSelector } from '@/store/hooks.ts';
import { Navigate } from 'react-router-dom';

interface Props {
	children: JSX.Element;
}

export const AuthRedirect: FC<Props> = ({ children }) => {
	const isAuth = useAppSelector((state) => state.user.isAuth);
	if (isAuth) {
		return <Navigate to="/" replace />;
	}
	return <>{children}</>;
};

