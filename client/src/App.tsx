import { RouterProvider } from 'react-router-dom';
import { routes } from '@/router/routes.tsx';
import { useAppDispatch } from '@/store/hooks.ts';
import { getTokenFromLocalStorage } from '@/helpers/localstorage.helper.ts';
import { AuthService } from '@/services/auth.service.ts';
import { logout, login } from '@/store/user/userSlice.ts';
import { useEffect, useState } from 'react';
import { IResponseUserData } from '@/types/types.ts';


function App() {
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = getTokenFromLocalStorage();
		if (token) {
			AuthService.getMe()
				.then(user => {
					if (user) {
						const authData: IResponseUserData = {
							user: {
								id: user.id,
								email: user.email,
								firstName: user.firstName,
								lastName: user.lastName,
								phoneNumber: user.phoneNumber,
								roles: user.roles,
							},
							accessToken: token,
						};
						dispatch(login(authData));
					} else {
						dispatch(logout());
					}
				})
				.catch(() => dispatch(logout()))
				.finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
		}
	}, [dispatch]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-green-700 text-green-200">
				<svg className="animate-spin h-14 w-14 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
				</svg>
				<h1 className="text-2xl">Loading Application...</h1>
			</div>
		);
	}
	return (
		<RouterProvider router={routes} />

	);
}

export default App;