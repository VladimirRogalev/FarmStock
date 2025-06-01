import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks.ts';
import { useAuth } from '@/hooks/useAuth';
import { becomeFarmer, deleteUserAccount, updateUserProfile } from '@/services/user.service.ts';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { IUser, UpdateUserDto } from '@/types/types.ts';
import { actionUpdateUserProfile, logout } from '@/store/user/userSlice.ts';
import { updateFormSchema, UpdateFormSchemaData } from '@/schemas/updateFormSchema.ts';

type FormErrors = Partial<Record<keyof UpdateFormSchemaData, string[] | undefined>>;


const UserProfile: FC = () => {

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user, isAuth } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [formData, setFormData] = useState<UpdateUserDto>({
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: ''
	});

	const [formErrors, setFormErrors] = useState<FormErrors | null>(null);

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				email: user.email || '',
				phoneNumber: user.phoneNumber || '',
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: '',
			});
		}
	}, [user]);

	if (!isAuth || !user) {
		return <p className="text-center mt-10"> Loading profile or not authenticated...</p>;
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (formErrors && formErrors[name as keyof FormErrors]) {
			setFormErrors(prevErrors => ({
				...prevErrors,
				[name]: undefined,
			}));
		}
	};
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormErrors(null);
		const dataToValidate = {
			...formData,
			phoneNumber: formData.phoneNumber?.trim() === '' ? undefined : formData.phoneNumber,
		};
		const validationResult = updateFormSchema.safeParse(dataToValidate);

		if (!validationResult.success) {
			const errors = validationResult.error.flatten().fieldErrors;
			setFormErrors(errors as FormErrors);
			toast.error('Please correct the errors in the form.');
			return;
		}
		const validatedData = validationResult.data;

		const dto: UpdateUserDto = {
			firstName: validatedData.firstName,
			lastName: validatedData.lastName,
			email: validatedData.email,
			phoneNumber: validatedData.phoneNumber || undefined,
		};

		if (validatedData.currentPassword && validatedData.newPassword) {
			(dto as any).currentPassword = validatedData.currentPassword;
			(dto as any).newPassword = validatedData.newPassword;
		}

		try {
			const updateUserData: IUser = await updateUserProfile(dto);
			dispatch(actionUpdateUserProfile(updateUserData));
			setIsEditing(false);
			toast.success('Profile updated successfully!');
			setFormData(prev => ({
				...prev,
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: '',
			}));
		} catch (error) {
			console.error('Failed to update profile:', error);
			setFormData(prev => ({
				...prev,
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: '',
			}));
			if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'errors' in error.response.data) {
				setFormErrors(error.response.data.errors as FormErrors);
				toast.error('Failed to update profile. Please check the errors.');
			} else if (error instanceof Error) {
				toast.error(error.message || 'Failed to update profile. Please try again.');
			} else {
				toast.error('Failed to update profile. Please try again.');
			}
		}
	};
	const handleCancelEdit = () => {
		setIsEditing(false);
		setFormErrors(null);
		if (user) {
			setFormData({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				email: user.email || '',
				phoneNumber: user.phoneNumber || '',
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: '',

			});
		}
	};
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
	const handleDeleteAccount = async () => {
		if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
			return;
		}
		setIsDeleting(true);
		try {
			await deleteUserAccount();
			toast.success('Your account has been successfully deleted.');
			dispatch(logout());
			navigate('/');
		} catch (error) {
			console.error('Failed to delete account:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to delete account. Please try again later.');
		} finally {
			setIsDeleting(false);
		}
	};
	const isFarmer = user.roles?.includes('FARMER');
	const inputClass = (fieldName: keyof FormErrors) =>
		`mt-1 block w-full px-3 py-2 border ${formErrors?.[fieldName] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;


	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">My Profile</h1>
			<div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8 text-gray-700">
				{!isEditing ? (
					<div>
						<div className="space-y-3 mb-6">
							<p><span className="font-medium text-gray-600">First Name:</span> <span className="text-gray-800">{user.firstName || 'Not specified'}</span></p>
							<p><span className="font-medium text-gray-600">Last Name:</span> <span className="text-gray-800">{user.lastName || 'Not specified'}</span></p>
							<p><span className="font-medium text-gray-600">Email:</span> <span className="text-gray-800">{user.email}</span></p>
							<p><span className="font-medium text-gray-600">Phone Number:</span> <span className="text-gray-800">{user.phoneNumber || 'Not specified'}</span></p>
						</div>
						<button onClick={() => setIsEditing(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">Edit Profile</button>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						<div className="space-y-4 mb-6">
							<div>
								<label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
								<input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClass('firstName')} />
								{formErrors?.firstName && <p className="mt-1 text-xs text-red-600">{formErrors.firstName[0]}</p>}
							</div>
							<div>
								<label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
								<input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleInputChange} className={inputClass('lastName')} />
								{formErrors?.lastName && <p className="mt-1 text-xs text-red-600">{formErrors.lastName[0]}</p>}
							</div>
							<div>
								<label htmlFor="email" className="block text-sm font-medium">Email</label>
								<input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className={inputClass('email')} />
								{formErrors?.email && <p className="mt-1 text-xs text-red-600">{formErrors.email[0]}</p>}
							</div>
							<div>
								<label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
								<input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} className={inputClass('phoneNumber')} />
								{formErrors?.phoneNumber && <p className="mt-1 text-xs text-red-600">{formErrors.phoneNumber[0]}</p>}
							</div>

							<hr className="my-6 border-gray-200" />
							<h3 className="text-lg font-medium text-gray-800 mb-3">Change Password</h3>
							<p className="text-xs text-gray-500 mb-3">Leave these fields blank if you do not want to change your password.</p>
							<div>
								<label htmlFor="currentPassword" className="block text-sm font-medium">Current Password</label>
								<input type="password" name="currentPassword" id="currentPassword" value={formData.currentPassword} onChange={handleInputChange} className={inputClass('currentPassword')} />
								{formErrors?.currentPassword && <p className="mt-1 text-xs text-red-600">{formErrors.currentPassword[0]}</p>}
							</div>
							<div>
								<label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
								<input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleInputChange} className={inputClass('newPassword')} />
								{formErrors?.newPassword && <p className="mt-1 text-xs text-red-600">{formErrors.newPassword[0]}</p>}
							</div>
							<div>
								<label htmlFor="confirmNewPassword" className="block text-sm font-medium">Confirm New Password</label>
								<input type="password" name="confirmNewPassword" id="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleInputChange} className={inputClass('confirmNewPassword')} />
								{formErrors?.confirmNewPassword && <p className="mt-1 text-xs text-red-600">{formErrors.confirmNewPassword[0]}</p>}
							</div>
						</div>
						<div className="flex items-center justify-end space-x-3">
							<button type="button" onClick={handleCancelEdit} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg">Cancel</button>
							<button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">Save Changes</button>
						</div>
					</form>
				)}

				<hr className="my-6 md:my-8 border-gray-200" />
				<div className="text-center">
					{isFarmer ? (
						<>
							<CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
							<p className="text-lg font-semibold text-green-700 mb-3">You are already a farmer!</p>
							<Link to="/farmer/dashboard" className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-sm">Go to Farmer Dashboard</Link>
						</>
					) : (
						<button onClick={handleBecomeFarmer} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">Become a Farmer</button>
					)}
				</div>

				<hr className="my-8 border-gray-300" />
				<div className="mt-8 p-4 border border-red-300 rounded-lg bg-red-50">
					<h3 className="text-lg font-medium text-red-700 mb-2">Delete Account</h3>
					<p className="text-sm text-red-600 mb-4">Warning: Deleting your account is permanent and cannot be undone. All your data associated with FarmStock will be removed.</p>
					<button onClick={handleDeleteAccount} disabled={isDeleting} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md disabled:opacity-50 flex items-center justify-center">
						<TrashIcon className="w-5 h-5 mr-2" />
						{isDeleting ? 'Deleting...' : 'Delete My Account'}
					</button>
				</div>
			</div>
		</div>
	);
};
export default UserProfile;

