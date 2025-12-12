import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { forgotPassword } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await forgotPassword(email);
      
      setSuccess(true);
      toast.success('Password reset instructions sent to your email');
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Forgot Password | Collaborative Storytelling">
      <Head>
        <title>Forgot Password | Collaborative Storytelling</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Reset Your Password</h1>

          {success ? (
            <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
              <p>We&apos;ve sent password reset instructions to your email address.</p>
              <p className="mt-2">
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <div className="mt-4">
                <Link href="/login" className="btn-primary inline-block">
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Enter your email address below and we&apos;ll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </form>

              <div className="mt-4 text-center text-sm">
                <p>
                  <Link href="/login" className="text-primary-600 hover:text-primary-700">
                    Back to Login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}