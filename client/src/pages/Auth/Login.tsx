import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service.ts';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { LoginFormSchema, loginSchema } from '@/schemas/loginFormSchema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/store/hooks.ts';
import { login } from '@/store/user/userSlice.ts';
import { GoogleLogin } from '@react-oauth/google';

const Login: FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<LoginFormSchema>({
		resolver: zodResolver(loginSchema)
	})

	const onSubmit = async (data: LoginFormSchema) => {
		try {
			const res = await AuthService.login(data)

			if (res?.accessToken) {
				localStorage.setItem('token', res.accessToken)
				dispatch(login(res))

				toast.success(`Welcome , ${res.user.firstName} ${res.user.lastName}!`)
				reset()
				navigate('/')
			}
		} catch (err: unknown) {
			let errorMessage = 'Login failed';
			if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
				errorMessage = String(err.response.data.message);
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}
			toast.error(errorMessage);
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
			<div className="flex flex-col items-center mt-8 gap-4">
				<div className="relative w-full">
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="bg-green-800 px-2 text-white/70 text-sm">or continue with</span>
					</div>
					<div className="border-t border-white/30" />
				</div>

				<div className="w-full flex justify-center">
					<GoogleLogin
						theme="filled_black"
						size="large"
						width="100%"
						text="continue_with"
						onSuccess={async (credentialResponse) => {
							const token = credentialResponse.credential
							if (!token) {
								toast.error('Google login failed: no token')
								return
							}

							try {
								const res = await AuthService.googleLogin(token)

								if (res?.accessToken) {
									localStorage.setItem('token', res.accessToken)

									dispatch(login(res))

									toast.success(`Welcome, ${res.user.firstName } ${res.user.lastName }!`)
									navigate('/')
								}

							} catch (err: unknown) {
								let errorMessage = 'Google login failed';
								if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
									errorMessage = String(err.response.data.message);
								} else if (err instanceof Error) {
									errorMessage = err.message;
								}
								toast.error(errorMessage);
							}
						}}
						onError={() => {
							toast.error('Google login was cancelled or failed')
						}}
					/>
				</div>
			</div>

			<div className="mt-5">
				<Link to="/auth/register" className="text-green-200 underline hover:text-white">
					Don't have an account?
				</Link>
			</div>
		</div>
	)
}

export default Login