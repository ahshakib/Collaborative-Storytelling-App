import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { resetPassword } from '../services/authService';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get token from URL query parameter
    if (router.query.token) {
      setToken(router.query.token);
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword(token, newPassword);
      
      setSuccess(true);
      toast.success('Password has been reset successfully');
      
      // Store the new token if returned
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Invalid or expired token. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Reset Password | Collaborative Storytelling">
      <Head>
        <title>Reset Password | Collaborative Storytelling</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Reset Your Password</h1>

          {success ? (
            <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
              <p>Your password has been reset successfully!</p>
              <p className="mt-2">You will be redirected to the home page shortly.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              {!token && (
                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md mb-4">
                  No reset token found. Please make sure you clicked the correct link from your email.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                    required
                    disabled={!token || isSubmitting}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    required
                    disabled={!token || isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={!token || isSubmitting}
                >
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
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