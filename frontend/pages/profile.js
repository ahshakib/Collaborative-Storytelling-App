import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getAllStories } from '../services/storyService';

export default function Profile() {
  const { isAuthenticated, user, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
  });
  const [stats, setStats] = useState({
    storiesCreated: 0,
    contributions: 0,
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Populate form with user data when available
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
      });
      fetchUserStats();
    }
  }, [isAuthenticated, loading, user, router]);

  const fetchUserStats = async () => {
    try {
      const storiesResponse = await getAllStories({ creator: user._id });
      const contributionsResponse = await getAllStories({ contributors: user._id, creator: { $ne: user._id } });
      
      setStats({
        storiesCreated: storiesResponse.stories.length,
        contributions: contributionsResponse.stories.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <Layout title="Profile | Collaborative Storytelling">
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile | Collaborative Storytelling">
      <Head>
        <title>Profile | Collaborative Storytelling</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-primary-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.username}</h1>
                <p className="text-gray-500 mb-4">{user?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium">
                    Member since {new Date().getFullYear()}
                  </div>
                  <div className="bg-secondary-50 text-secondary-700 px-4 py-2 rounded-lg text-sm font-medium">
                    Writer Level 1
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.storiesCreated}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.contributions}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Contributions</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Edit Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          className="input-field bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                          required
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="input-field bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary px-8 py-2.5 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar / Account Settings */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Account Security</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Manage your password and account security settings.
                  </p>
                  <button
                    onClick={() => router.push('/change-password')}
                    className="w-full btn-outline border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    Change Password
                  </button>
                </div>

                <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl shadow-lg p-6 text-white">
                  <h2 className="text-lg font-bold mb-2">Pro Tips</h2>
                  <ul className="text-sm space-y-2 text-primary-100">
                    <li className="flex items-start gap-2">
                      <span>✨</span>
                      <span>Complete your bio to get more followers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>📝</span>
                      <span>Write consistently to level up your writer rank.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>🤝</span>
                      <span>Collaborate with others to expand your network.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}