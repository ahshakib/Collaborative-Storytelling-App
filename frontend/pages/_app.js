import { Toaster } from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import SmoothScroll from '../components/SmoothScroll';
import ThemeToggle from '../components/ThemeToggle';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SmoothScroll />
        <Component {...pageProps} />
        <ThemeToggle />
        <Toaster position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;