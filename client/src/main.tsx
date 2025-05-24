import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '@/store/store.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(
	<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
	<Provider store={store}>
		<App />
		<ToastContainer position="bottom-left" autoClose={2000} />
	</Provider>
	</GoogleOAuthProvider>
);
