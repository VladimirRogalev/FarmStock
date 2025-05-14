import img from '../assets/page_not_found.png'
import { Link } from 'react-router-dom';
const ErrorPage = () => {
	return (
		<div className=" flex min-h-screen flex-col items-center justify-center gap-10 bg-slate-900 font-geist text-white">
			<img src={img} alt="error"/>
			<Link to={"/"} className="bg-sky-500 rounded-md px-6 py-2 hover:bg-sky-600">Go Home</Link>
		</div>
	);
};
export default ErrorPage;
