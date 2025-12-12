import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
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

  const fetchUserStats = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

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
  }, [isAuthenticated, loading, user, router, fetchUserStats]);

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

      <div className="min-h-screen bg-neo-off-white dark:bg-zinc-900 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            {/* Profile Header */}
            <div className="bg-white dark:bg-zinc-800 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative">
              <div className="absolute top-0 right-0 bg-neo-blue text-white px-4 py-1 text-sm font-black uppercase border-l-4 border-b-4 border-black">
                Writer Profile
              </div>
              
              <div className="relative group">
                <div className="w-32 h-32 bg-neo-yellow border-4 border-black flex items-center justify-center text-black text-5xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-black text-black dark:text-white mb-2 uppercase tracking-tighter">{user?.username}</h1>
                <p className="text-gray-600 dark:text-gray-300 font-bold mb-6 font-mono">{user?.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-neo-blue text-white px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-bold uppercase">
                    Member since {new Date().getFullYear()}
                  </div>
                  <div className="bg-neo-green text-black px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-bold uppercase">
                    Writer Level 1
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 border-t-4 md:border-t-0 md:border-l-4 border-black pt-6 md:pt-0 md:pl-8">
                <div className="text-center">
                  <div className="text-4xl font-black text-black dark:text-white">{stats.storiesCreated}</div>
                  <div className="text-xs font-bold uppercase tracking-widest mt-1">Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-black dark:text-white">{stats.contributions}</div>
                  <div className="text-xs font-bold uppercase tracking-widest mt-1">Contributions</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Edit Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-zinc-800 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                  <h2 className="text-2xl font-black text-black dark:text-white mb-8 uppercase border-b-4 border-black pb-2 inline-block">Edit Profile</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="username" className="block text-sm font-black uppercase mb-1">
                          Username
                        </label>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          className="neo-input w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-black uppercase mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="neo-input w-full bg-gray-200 cursor-not-allowed"
                          required
                          disabled
                        />
                        <p className="text-xs font-bold mt-1 text-gray-500 uppercase">Cannot be changed</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label htmlFor="bio" className="block text-sm font-black uppercase mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="neo-input w-full min-h-[120px]"
                        rows={4}
                        placeholder="Tell use about yourself..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="neo-btn-primary px-8 py-3 text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar / Account Settings */}
              <div className="space-y-8">
                <div className="bg-white dark:bg-zinc-800 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                  <h2 className="text-xl font-black text-black dark:text-white mb-4 uppercase">Security</h2>
                  <p className="text-sm font-medium mb-6">
                    Manage your password and account security settings.
                  </p>
                  <button
                    onClick={() => router.push('/change-password')}
                    className="w-full bg-white text-black border-2 border-black font-black uppercase py-3 hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                  >
                    Change Password
                  </button>
                </div>

                <div className="bg-neo-yellow border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-20 rotate-12">💡</div>
                  <h2 className="text-xl font-black mb-4 uppercase">Pro Tips</h2>
                  <ul className="text-sm space-y-3 font-bold">
                    <li className="flex items-start gap-3">
                      <span className="bg-black text-white p-1 text-xs">01</span>
                      <span>Complete your bio to get more followers.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-black text-white p-1 text-xs">02</span>
                      <span>Write consistently to level up your writer rank.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-black text-white p-1 text-xs">03</span>
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