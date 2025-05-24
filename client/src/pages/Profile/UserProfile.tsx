import { FC } from 'react';
import { useAppDispatch } from '@/store/hooks.ts';
import { useAuth } from '@/hooks/useAuth';
import { becomeFarmer } from '@/services/user.service.ts';
import { updateUserProfile } from '@/store/user/userSlice.ts';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const UserProfile: FC = () => {

	const dispatch = useAppDispatch();
	const { user, isAuth } = useAuth();
	if (!isAuth || !user) {
		return <p className="text-center mt-10"> Loading profile or not authenticated...</p>;
	}

	const handleBecomeFarmer = async () => {
		if (!window.confirm('Are you sure want to become a farmer')) {
			return;
		}
		try {
			const updateUser = await becomeFarmer();
			dispatch(updateUserProfile(updateUser));
			toast.success('Congratulations! You are now a farmer.');
		} catch (error) {
			console.error('Failed to become a farmer:', error);
			toast.error('Failed to become a farmer. Please try again later.');
		}
	};

	const isFarmer = user.roles?.includes('FARMER');


	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">My Profile</h1>
			<div className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8">
				<div className="mb-6">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">Account Details</h2>
					<div className="space-y-3">
						<p><span className="font-medium text-gray-600">First Name:</span> <span
							className="text-gray-800">{user.firstName || 'Not specified'}</span></p>
						<p><span className="font-medium text-gray-600">Last Name:</span> <span
							className="text-gray-800">{user.lastName || 'Not specified'}</span></p>
						<p><span className="font-medium text-gray-600">Email:</span> <span
							className="text-gray-800">{user.email}</span></p>
						<p><span className="font-medium text-gray-600">Phone number:</span> <span
							className="text-gray-800">{user.phoneNumber}</span></p>
					</div>
				</div>
				<hr className="my-6 border-gray-200" />
				<div className="text-center">
					{isFarmer ? (
						<>

							<CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
							<svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<p className="text-xl font-semibold text-green-700 mb-4">
								You are already a farmer!
							</p>
							<Link
								to="/farmer/dashboard"
								className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
							>
								Go to Farmer Dashboard
							</Link>
						</>
					) : (
						<>

							<p className="text-lg text-gray-600 mb-4">
								Want to sell your products? Become a farmer!
							</p>

							<button
								onClick={handleBecomeFarmer}
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
							>
								Become a Farmer
							</button>
						</>
					)}
				</div>


                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <button className="text-blue-500 hover:text-blue-700 font-medium mr-4">Edit Profile</button>
                    <button className="text-red-500 hover:text-red-700 font-medium">Delete Account</button>
                </div>

			</div>
		</div>
	);
};
			export default UserProfile;
