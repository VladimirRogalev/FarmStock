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
import { EditProfileForm } from './EditProfileForm';
import { ProfileDetails } from './ProfileDetails';
import { ProfileActions } from './ProfileActions';
import { DeleteModal } from './DeleteModal';

type FormErrors = Partial<Record<keyof UpdateFormSchemaData, string[] | undefined>>;

type UpdateDto = UpdateFormSchemaData & {
	currentPassword?: string;
	newPassword?: string;
};

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

		const dto: UpdateDto = {
			...validatedData,
			currentPassword: validatedData.currentPassword,
			newPassword: validatedData.newPassword,
		};

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
				{isEditing ? (
					<EditProfileForm
						user={user}
						onSave={handleSubmit}
						onCancel={handleCancelEdit}
						formData={formData}
						formErrors={formErrors}
						onInputChange={handleInputChange}
						inputClass={inputClass}
					/>
				) : (
					<ProfileDetails user={user} />
				)}

				<ProfileActions
					isEditing={isEditing}
					onEdit={() => setIsEditing(true)}
					onDelete={() => setIsDeleting(true)}
					onBecomeFarmer={handleBecomeFarmer}
					isFarmer={isFarmer}
				/>

				<DeleteModal
					isOpen={isDeleting}
					onClose={() => setIsDeleting(false)}
					onConfirm={handleDeleteAccount}
				/>
			</div>
		</div>
	);
};
export default UserProfile;

