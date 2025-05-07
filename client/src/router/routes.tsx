
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/pages/Layout.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import Login from '@/pages/Auth/Login.tsx';
import Register from '@/pages/Auth/Register.tsx';
import FarmsList from '@/pages/Farms/FarmsList.tsx';
import FarmDetail from '@/pages/Farms/FarmDetail.tsx';
import Home from '@/pages/Home.tsx';

export const routes = createBrowserRouter([
	{
		path:'/',
		element: <Layout/>,
		errorElement: <ErrorPage/>,
		children: [
			{
				index: true,
				element: <Home/>
			},
			{
				path: '/auth/login',
				element: <Login/>
			},
			{
				path: '/auth/register',
				element: <Register/>
			},
			{
				path: '/auth/register',
				element: <Register/>
			},
			{
				path: '/farms',
				element: <FarmsList/>
			},
			{
				path: '/farms/:id',
				element: <FarmDetail/>
			},

		]
	}
])