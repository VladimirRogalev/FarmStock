export function AuthPanel() {
	const handleGoogleLogin = () => {
		window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-md w-72">
			<h2 className="text-lg font-bold mb-4 text-center">You are Welcome!</h2>
			<button
				onClick={handleGoogleLogin}
				className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
			>
				Entry from Google
			</button>
		</div>
	);
}