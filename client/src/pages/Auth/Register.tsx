import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service.ts';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { RegisterFormSchema, registerSchema } from '@/schemas/registerFormSchema.ts';
import { zodResolver } from '@hookform/resolvers/zod';

const Register: FC = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<RegisterFormSchema>({
		resolver: zodResolver(registerSchema)
	});

	const onSubmit = async (data: RegisterFormSchema) => {
		try {
			const { firstName, lastName, email, phoneNumber, password } = data;
			const res = await AuthService.register({ firstName, lastName, email, phoneNumber, password });
			if(res) {
				localStorage.setItem('token', res.accessToken)
				toast.success(`Welcome, ${res.user.firstName} ${res.user.lastName} !`)
				reset();
				navigate('/auth/login');
			}

		} catch (error: any) {
			const errorMessage = error.response?.data.message;
			toast.error(errorMessage.toString());
		}
	};


	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-green-700 text-green-200">
			<h1 className="mb-10 text-center text-xl">Register</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-5">
				<div>
					<input type="text" className="input w-full" placeholder="First Name" {...register('firstName')} />
					{errors.firstName && <p className="text-red-300 text-sm mt-1">{errors.firstName.message}</p>}
				</div>

				<div>
					<input type="text" className="input w-full" placeholder="Last Name" {...register('lastName')} />
					{errors.lastName && <p className="text-red-300 text-sm mt-1">{errors.lastName.message}</p>}
				</div>

				<div>
					<input type="email" className="input w-full" placeholder="Email" {...register('email')} />
					{errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
				</div>

				<div>
					<input type="text" className="input w-full" placeholder="Phone Number" {...register('phoneNumber')} />
					{errors.phoneNumber && <p className="text-red-300 text-sm mt-1">{errors.phoneNumber.message}</p>}
				</div>

				<div>
					<input type="password" className="input w-full" placeholder="Password" {...register('password')} />
					{errors.password && <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>}
				</div>

				<div>
					<input type="password" className="input w-full" placeholder="Confirm Password" {...register('confirmPassword')} />
					{errors.confirmPassword && <p className="text-red-300 text-sm mt-1">{errors.confirmPassword.message}</p>}
				</div>

				<button type="submit" className="btn btn-green mx-auto">Submit</button>
			</form>

			<div className="mt-5">
				<Link to="/auth/login" className="text-green-200 hover:text-white">
					Already have an account?
				</Link>
			</div>
		</div>
	)
};
export default Register;
