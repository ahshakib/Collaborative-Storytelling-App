import { Toaster } from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;