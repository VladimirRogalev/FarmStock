import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/pages/Layout.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import Login from '@/pages/Auth/Login.tsx';
import Register from '@/pages/Auth/Register.tsx';
import FarmsList from '@/pages/Farms/FarmsList.tsx';
import FarmDetail from '@/pages/Farms/FarmDetail.tsx';
import Home from '@/pages/Home.tsx';
import { ProtectedRoutes } from '@/components/ProtectedRoutes.tsx';
import UserProfile from '@/pages/Profile/UserProfile';
import ManageBags from '@/pages/Farmer/ManageBags.tsx';
import Dashboard from '@/pages/Farmer/Dashboard.tsx';
import OrderSuccess from '@/pages/OrderSuccess.tsx';
import Checkout from '@/pages/Checkout';
import Cart from '@/pages/Cart';
import SurpriseBagsDetail from '@/pages/SurpriseBags/SurpriseBagsDetail';
import SurpriseBagsList from '@/pages/SurpriseBags/SurpriseBagsList.tsx';
import CreateBag from '@/pages/Farmer/CreateBag.tsx';
import { AuthRedirect } from '@/components/AuthRedirect.tsx';
import FarmerOrders from '@/pages/Farmer/FarmerOrders.tsx';

export const routes = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
		
			{
				index: true,
				element: <Home />
			},
			{
				path: '/auth/login',
				element:
					<AuthRedirect>
						<Login />
					</AuthRedirect>

			},
			{
				path: '/auth/register',
				element:
					<AuthRedirect>
						<Register />
					</AuthRedirect>

			},
			{
				path: 'users/profile',
				element: (
					<ProtectedRoutes>
						<UserProfile />
					</ProtectedRoutes>
				)
			},

			{
				path: 'farms',
				element: (
					<FarmsList />
				)
			},
			{
				path: 'farms/:id',
				element: (
					<ProtectedRoutes>
						<FarmDetail />
					</ProtectedRoutes>
				)
			},


			{
				path: 'bags',
				element: (
					<SurpriseBagsList />
				)
			},
			{
				path: 'bags/:id',
				element: (
					<ProtectedRoutes>
						<SurpriseBagsDetail />
					</ProtectedRoutes>
				)
			},


			{
				path: 'cart',
				element: (
					<ProtectedRoutes>
						<Cart />
					</ProtectedRoutes>
				)
			},
			{
				path: 'checkout',
				element: (
					<ProtectedRoutes>
						<Checkout />
					</ProtectedRoutes>
				)
			},
			{
				path: 'order-success',
				element: (
					<ProtectedRoutes>
						<OrderSuccess />
					</ProtectedRoutes>
				)
			},


			{
				path: 'farmer/dashboard',
				element: (
					<ProtectedRoutes>
						<Dashboard />
					</ProtectedRoutes>
				)
			},
			{
				path: 'farmer/create-bag',
				element: (
					<ProtectedRoutes>
						<CreateBag />
					</ProtectedRoutes>
				)
			},
			{
				path: 'farmer/manage-bags',
				element: (
					<ProtectedRoutes>
						<ManageBags />
					</ProtectedRoutes>
				)
			},
			{
				path: 'farmer/orders',
				element: (
					<ProtectedRoutes>
						<FarmerOrders />
					</ProtectedRoutes>
				)
			},

			{
				path: 'profile',
				element: (
					<ProtectedRoutes>
						<UserProfile />
					</ProtectedRoutes>
				)
			}
		]
	}
]);

