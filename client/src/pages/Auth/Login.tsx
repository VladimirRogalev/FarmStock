import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

const Login: FC = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setpassword] = useState<string>('');
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-green-700 text-green-200">
			<h1 className="mb-10 text-center text-xl">Login</h1>

			<form className="w-full max-w-md flex flex-col gap-5">
				<input type="text"
					   className="input"
					   placeholder="Email"
					   onChange={(e)=> setEmail(e.target.value)}
				/>
				<input type="password"
					   className="input"
					   placeholder="Password"
					   onChange={(e)=> setpassword(e.target.value)}
				/>
				<button className="btn btn-green mx-auto">Submit</button>
			</form>

			<div className=" mt-5">
				<Link to="/auth/register" className="text-green-200 hover:text-gray-800">
					You don't have an account?
				</Link>
			</div>
		</div>
	);
};
export default Login;
