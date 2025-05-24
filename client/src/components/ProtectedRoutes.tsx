import { FC, JSX, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth.ts';
import protected_icon from '../assets/protected-icon.png';
import { useNavigate } from 'react-router-dom';

interface Props {
	children: JSX.Element;
}

export const ProtectedRoutes: FC<Props> = ({ children }) => {
	const isAuth = useAuth();
	const navigate = useNavigate();


	useEffect(() => {
		if (!isAuth) {
			navigate('/auth/login', { replace: true })

		}
	}, [isAuth, navigate]);
	if (!isAuth)  {
		return (
			<div className="flex flex-col items-center justify-center gap-10 mt-20">
				<h1 className="text-2xl text-green-200">Redirect to login page.</h1>
				<img className="w-1/3"  src={protected_icon} alt="img" />
			</div>
		)
	}
	return <>{children}</>;
};
