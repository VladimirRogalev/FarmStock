import { FC } from 'react';
import { Link } from 'react-router-dom';

const Register: FC = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-green-700 text-green-200">
			<h1 className="mb-10 text-center text-xl">Register</h1>

			<form className="w-full max-w-md flex flex-col gap-5">
				<input type="text" className="input" placeholder="Email" />
				<input type="password" className="input" placeholder="Password" />
				<input type="password" className="input" placeholder="Confirm Password" />
				<button className="btn btn-green mx-auto">Submit</button>
			</form>

			<div className=" mt-5">

				<Link to="/auth/login" className="text-green-200 hover:text-gray-800">
					Already have an account?
				</Link>

			</div>
		</div>
	);
};
export default Register;
