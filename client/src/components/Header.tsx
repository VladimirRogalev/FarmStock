import { Link, NavLink } from 'react-router-dom';
import { GiFarmer } from 'react-icons/gi';
import { FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
	const isAuth = true;
	return (
		<header className="flex items-center  bg-green-500 p-4 shadow-sm backdrop-blur-sm">
			<Link to="/">
				<GiFarmer size={20} />
			</Link>
			{isAuth && (
				<nav className="ml-auto mr-10">
					<ul className="flex items-center gap-5">
						<li>
							<NavLink to={'/'}
									 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-800'}>Home</NavLink>
						</li>
						<li>
							<NavLink to={'/auth/login'}
									 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-800'}>Login</NavLink>
						</li>
						<li>
							<NavLink to={'/auth/register'}
									 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-800'}>Register</NavLink>
						</li>

					</ul>
				</nav>
			)}

			{/*actions*/}
			{
				isAuth ? (
					<button className="btn btn-red">
						<span>Logout</span>
						<FaSignOutAlt/>
					</button>
				) : (
					<Link
						className = "py-2 text-white/50 hover:text-white ml-auto"
						to={'auth'}
					>Log in / Sign In</Link>
				)
			}
		</header>
	);
};
export default Header;
