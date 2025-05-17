import { RouterProvider } from 'react-router-dom';
import { routes } from '@/router/routes.tsx';
import { useAppDispatch } from '@/store/hooks.ts';
import { getTokenFromLocalStorage } from '@/helpers/localstorage.helper.ts';
import { AuthService } from '@/services/auth.service.ts';
import { logout, login } from '@/store/user/userSlice.ts';
import { useEffect } from 'react';


function App() {
	const dispatch = useAppDispatch();

	const checkAuth = async () => {
		const token = getTokenFromLocalStorage();
		try {
	if (token) {
		const data = await AuthService.getMe();
		if (data) {
			dispatch(login({
				id: data.id,
				email: data.email,
				token: token,
			}))
		} else {
			dispatch(logout())
		}
	}
		} catch (error) {
		}
	}

	useEffect(() => {
		checkAuth();
	}, [])
	return (
		<RouterProvider router={routes} />

	);
}

export default App;