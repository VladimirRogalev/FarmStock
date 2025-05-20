import  { FC } from 'react';
import { useAppSelector } from '@/store/hooks.ts';

const UserDisplayName : FC = () => {
	const { user } = useAppSelector(state => state.user);

	if (!user) return <>Profile</>;

	if (user.firstName && user.lastName) {
		return <>{user.firstName} {user.lastName}</>;
	}

	if (user.email) {
		return <>{user.email}</>;
	}

	return <>Profile</>;
};

export default UserDisplayName ;
