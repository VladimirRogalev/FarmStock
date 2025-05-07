import { Link, NavLink } from 'react-router-dom';
import { GiFarmer } from 'react-icons/gi';

const Header = () => {
	const isAuth = true;
	return (
		<header className="flex items-center justify-between bg-slate-800 p-4 shadow-sm backdrop-blur-sm">
			<Link to="/">
				<GiFarmer size={20} />
			</Link>
			{isAuth && (
				<nav>
					<ul className="ml-auto mr-10 flex items-center gap-5">
						<li>
							<NavLink to={'/'}
									 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-50'}>Home</NavLink>
						</li>
						<li>
							<NavLink to={'/auth/login'}
									 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-50'}>Login</NavLink>
						</li>
						<li>
							<NavLink to={'/auth/register'}
									 className={({ isActive }) => isActive ? 'text-white' : 'text-gray-50'}>Register</NavLink>
						</li>

					</ul>
				</nav>
			)}
		</header>
	);
};
export default Header;
