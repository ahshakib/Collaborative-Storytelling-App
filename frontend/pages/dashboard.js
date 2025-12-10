import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';
import { getUserDrafts } from '../services/contributionService';
import { getAllStories } from '../services/storyService';

export default function Dashboard() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('myStories');
  const [myStories, setMyStories] = useState([]);
  const [myContributions, setMyContributions] = useState([]);
  const [myDrafts, setMyDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, [isAuthenticated, loading, user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch stories created by the user
      const storiesResponse = await getAllStories({ creator: user._id });
      setMyStories(storiesResponse.stories);

      // Fetch stories the user has contributed to
      const contributionsResponse = await getAllStories({ contributors: user._id, creator: { $ne: user._id } });
      setMyContributions(contributionsResponse.stories);

      // Fetch user drafts
      const draftsResponse = await getUserDrafts();
      setMyDrafts(draftsResponse.drafts);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load your dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <Layout title="Dashboard | Collaborative Storytelling">
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const stats = [
    { label: 'Stories Created', value: myStories.length, icon: '📝', color: 'bg-blue-100 text-blue-600' },
    { label: 'Contributions', value: myContributions.length, icon: '✍️', color: 'bg-purple-100 text-purple-600' },
    { label: 'Drafts', value: myDrafts.length, icon: '📄', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <Layout title="Dashboard | Collaborative Storytelling">
      <Head>
        <title>Dashboard | Collaborative Storytelling</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your stories.</p>
            </div>
            <Link href="/stories/create" className="mt-4 md:mt-0 btn-primary shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:-translate-y-0.5 transition-all">
              Create New Story
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 border border-red-100">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            <div className="border-b border-gray-100">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('myStories')}
                  className={`flex-1 py-4 text-center font-medium text-sm transition-colors relative ${
                    activeTab === 'myStories' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Stories
                  {activeTab === 'myStories' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('contributions')}
                  className={`flex-1 py-4 text-center font-medium text-sm transition-colors relative ${
                    activeTab === 'contributions' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Contributions
                  {activeTab === 'contributions' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`flex-1 py-4 text-center font-medium text-sm transition-colors relative ${
                    activeTab === 'drafts' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Drafts
                  {activeTab === 'drafts' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                </button>
              </nav>
            </div>

            <div className="p-6 md:p-8">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'myStories' && (
                    <motion.div
                      key="myStories"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {myStories.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                            📝
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                          <p className="text-gray-500 mb-6">You haven't created any stories yet. Start your journey today!</p>
                          <Link href="/stories/create" className="btn-primary">
                            Create Your First Story
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myStories.map((story) => (
                            <StoryCard key={story._id} story={story} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'contributions' && (
                    <motion.div
                      key="contributions"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {myContributions.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                            ✍️
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions yet</h3>
                          <p className="text-gray-500 mb-6">You haven't contributed to any stories yet. Browse stories to find one you like!</p>
                          <Link href="/stories" className="btn-primary">
                            Browse Stories
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myContributions.map((story) => (
                            <StoryCard key={story._id} story={story} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'drafts' && (
                    <motion.div
                      key="drafts"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {myDrafts.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                            📄
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts yet</h3>
                          <p className="text-gray-500 mb-6">You don't have any saved drafts.</p>
                          <Link href="/stories" className="btn-primary">
                            Browse Stories
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {myDrafts.map((draft) => (
                            <div key={draft._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{draft.storyId?.title || 'Unknown Story'}</h3>
                              <p className="text-gray-600 mb-4 line-clamp-3">{draft.content}</p>
                              <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-500">
                                  {new Date(draft.createdAt).toLocaleDateString()}
                                </span>
                                <Link href={`/stories/${draft.storyId?._id}`} className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                                  Continue Writing →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}