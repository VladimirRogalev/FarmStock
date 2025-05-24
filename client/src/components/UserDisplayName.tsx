import  { FC } from 'react';
import { useAppSelector } from '@/store/hooks.ts';

const UserDisplayName : FC = () => {
	const { user } = useAppSelector(state => state.user);

	if (!user) return <>Profile</>;

	const firstName = user.firstName?.trim();
	const lastName = user.lastName?.trim();
	const nameParts: string[] = [];

	if (firstName) {
		nameParts.push(firstName);
	}

	if (lastName) {
		nameParts.push(lastName);
	}
	if (nameParts.length > 0) {
		return <>{nameParts.join(' ')}</>;
	}

	if (user.email) {
		return <>{user.email}</>;
	}


	if (user.email) {
		return <>{user.email}</>;
	}

	return <>Profile</>;
};

export default UserDisplayName ;
