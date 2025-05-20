import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GiFarmer } from 'react-icons/gi';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts';
import { logout } from '@/store/user/userSlice.ts';
import { removeTokenFromLocalStorage } from '@/helpers/localstorage.helper.ts';
import { toast } from 'react-toastify';
import UserDisplayName from '@/components/UserDisplayName.tsx';

const Header = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { isAuth } = useAppSelector(state => state.user);

	const logoutHandler = () => {
		dispatch(logout());
		removeTokenFromLocalStorage('token');
		toast.success('Logout successful');
		navigate('/');
	};

	return (
		<header className="flex items-center justify-between bg-green-500 p-4 shadow-sm backdrop-blur-sm">

			<Link to="/" className="text-white">
				<GiFarmer size={24} />
			</Link>


			<nav>
				<ul className="flex items-center gap-5">
					<li>
						<NavLink to="/" className={({ isActive }) => isActive ? 'text-white' : 'text-gray-100'}>
							Home
						</NavLink>
					</li>

					{!isAuth ? (
						<>
							<li>
								<NavLink to="/auth/login"
										 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-100'}>
									Login
								</NavLink>
							</li>
							<li>
								<NavLink to="/auth/register"
										 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-100'}>
									Register
								</NavLink>
							</li>
						</>
					) : (
						<>
							<li>
								<NavLink to="/users/profile"
										 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-100'}>
									<UserDisplayName/>
								</NavLink>
							</li>
							<li>
								<button className="btn btn-red flex items-center gap-2" onClick={logoutHandler}>
									Logout <FaSignOutAlt />
								</button>
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
