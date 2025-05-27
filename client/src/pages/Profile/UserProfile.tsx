import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks.ts';
import { useAuth } from '@/hooks/useAuth';
import { becomeFarmer, updateUserProfile } from '@/services/user.service.ts';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { IUser, UpdateUserDto } from '@/types/types.ts';
import { actionUpdateUserProfile } from '@/store/user/userSlice.ts';

const UserProfile: FC = () => {

	const dispatch = useAppDispatch();
	const { user, isAuth } = useAuth();
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState<UpdateUserDto>({
		firstName:'',
		lastName:'',
		email:'',
		phoneNumber:''
	});

	useEffect(() => {
		if (user){
			setFormData({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				email: user.email || '',
				phoneNumber: user.phoneNumber || ''
			})
		}
	}, [user]);
	if (!isAuth || !user) {
		return <p className="text-center mt-10"> Loading profile or not authenticated...</p>;
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormData({...formData, [e.target.name]: e.target.value});
	}
	const handleSubmit = async (e: FormEvent<HTMLFormElement>)=> {
		e.preventDefault();
		try{
			const dto: UpdateUserDto = {
				firstName: formData.firstName || undefined,
				lastName: formData.lastName || undefined,
				email: formData.email || undefined,
				phoneNumber: formData.phoneNumber || undefined,
			};
			const updateUserData: IUser= await  updateUserProfile(dto);
			dispatch(actionUpdateUserProfile(updateUserData));
			setIsEditing(false);
			toast.success('Profile updated successfully!')


		} catch(error){
			console.error('Failed to update profile:', error);
			toast.error('Failed to update profile. Please try again.')

		}
	}
 const handleCancelEdit = () =>{
		setIsEditing(false);
		if(user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				phoneNumber: user.phoneNumber || "",

			})
		}
 }
	const handleBecomeFarmer = async () => {
		if (!window.confirm('Are you sure want to become a farmer')) {
			return;
		}
		try {
			const updateUser = await becomeFarmer();
			dispatch(actionUpdateUserProfile(updateUser));
			toast.success('Congratulations! You are now a farmer.');
		} catch (error) {
			console.error('Failed to become a farmer:', error);
			toast.error('Failed to become a farmer. Please try again later.');
		}
	};

	const isFarmer = user.roles?.includes('FARMER');


	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
				My Profile
			</h1>

			<div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8 text-gray-700">
				{!isEditing ? (

					<div>
						<div className="space-y-3 mb-6">
							<p><span className="font-medium text-gray-600">First Name:</span> <span className="text-gray-800">{user.firstName || 'Not specified'}</span></p>
							<p><span className="font-medium text-gray-600">Last Name:</span> <span className="text-gray-800">{user.lastName || 'Not specified'}</span></p>
							<p><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-800">{user.email}</span></p>
							<p><span className="font-medium text-gray-600">Phone Number:</span> <span className="text-gray-800">{user.phoneNumber || 'Not specified'}</span></p>
							{/*<p><span className="font-medium text-gray-600">Roles:</span> <span className="text-gray-800">{user.roles?.join(', ') || 'User'}</span></p>*/}
						</div>
						<button
							onClick={() => setIsEditing(true)}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
						>
							Edit Profile
						</button>
					</div>
				) : (

					<form onSubmit={handleSubmit}>
						<div className="space-y-4 mb-6">
							<div>
								<label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
								<input
									type="text"
									name="firstName"
									id="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</div>
							<div>
								<label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
								<input
									type="text"
									name="lastName"
									id="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</div>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
								<input
									type="email"
									name="email"
									id="email"
									value={formData.email}
									onChange={handleInputChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
								{/*<p className="mt-1 text-xs text-gray-500">Changing email might require verification on some systems.</p>*/}
							</div>
							<div>
								<label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
								<input
									type="tel"
									name="phoneNumber"
									id="phoneNumber"
									value={formData.phoneNumber}
									onChange={handleInputChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</div>
						</div>
						<div className="flex items-center justify-end space-x-3">
							<button
								type="button"
								onClick={handleCancelEdit}
								className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
							>
								Save Changes
							</button>
						</div>
					</form>
				)}


				<hr className="my-6 md:my-8 border-gray-200" />
				<div className="text-center">
					{isFarmer && (
						<>
							<CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
							<p className="text-lg font-semibold text-green-700 mb-3">
								You are already a farmer!
							</p>
							<Link
								to="/farmer/dashboard"
								className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
							>
								Go to Farmer Dashboard
							</Link>
						</>
					)}

					{!isFarmer && (
						<button
							onClick={handleBecomeFarmer}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md"
						>
							Become a Farmer
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
			export default UserProfile;
