import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service.ts';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from '@/schemas/loginFormData.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/store/hooks.ts';
import { login } from '@/store/user/userSlice.ts';

const Login: FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema)
	})

	const onSubmit = async (data: LoginFormData) => {
		try {
			const res = await AuthService.login(data)

			if (res?.accessToken) {
				localStorage.setItem('token', res.accessToken)
				dispatch(login({
					id: res.user.id,
					email: res.user.email,
					token: res.accessToken,
				}))

				toast.success(`Welcome , ${res.user.firstName} ${res.user.lastName}!`)
				reset()
				navigate('/')
			}
		} catch (err: any) {
			const msg = err.response?.data?.message || 'Login failed'
			toast.error(msg.toString())
		}
	}


	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-green-700 text-green-200">
			<h1 className="mb-10 text-center text-xl">Login</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-5">
				<div>
					<input
						type="email"
						className="input w-full"
						placeholder="Email"
						{...register('email')}
					/>
					{errors.email && <p className="text-sm text-red-300 mt-1">{errors.email.message}</p>}
				</div>

				<div>
					<input
						type="password"
						className="input w-full"
						placeholder="Password"
						{...register('password')}
					/>
					{errors.password && (
						<p className="text-sm text-red-300 mt-1">{errors.password.message}</p>
					)}
				</div>

				<button type="submit" className="btn btn-green mx-auto">Submit</button>
			</form>

			<div className="mt-5">
				<Link to="/auth/register" className="text-green-200 underline hover:text-white">
					Don’t have an account?
				</Link>
			</div>
		</div>
	)
}

export default Login