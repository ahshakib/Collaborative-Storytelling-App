import { Toaster } from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default MyApp;