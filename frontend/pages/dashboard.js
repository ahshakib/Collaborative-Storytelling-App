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
    { label: 'STORIES CREATED', value: myStories.length, icon: '📝', color: 'bg-neo-blue text-white' },
    { label: 'CONTRIBUTIONS', value: myContributions.length, icon: '✍️', color: 'bg-neo-red text-white' },
    { label: 'DRAFTS', value: myDrafts.length, icon: '📄', color: 'bg-neo-yellow text-black' },
  ];

  return (
    <Layout title="Dashboard | Collaborative Storytelling">
      <Head>
        <title>Dashboard | Collaborative Storytelling</title>
      </Head>

      <div className="min-h-screen bg-neo-off-white dark:bg-zinc-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-4 border-black pb-8">
            <div>
              <h1 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
                Here's what's happening with your stories.
              </p>
            </div>
            <Link href="/stories/create" className="mt-6 md:mt-0 neo-btn-primary text-xl flex items-center gap-2 bg-neo-green text-black">
              <span>+</span> Create New Story
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ translateX: 4, translateY: 4, boxShadow: "0px 0px 0px 0px #000" }}
                className="bg-white dark:bg-zinc-800 p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center transition-all"
              >
                <div className={`w-16 h-16 ${stat.color} border-4 border-black flex items-center justify-center text-3xl mr-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-black dark:text-white text-sm font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-4xl font-black text-black dark:text-white">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="bg-neo-red text-white p-6 border-4 border-black font-bold mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-zinc-800 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[500px]">
            <div className="border-b-4 border-black bg-neo-yellow">
              <nav className="flex flex-wrap">
                {['myStories', 'contributions', 'drafts'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 text-center font-black uppercase tracking-wider text-sm sm:text-base border-r-4 border-black last:border-r-0 transition-all ${
                      activeTab === tab 
                        ? 'bg-black text-white' 
                        : 'bg-neo-yellow text-black hover:bg-white'
                    }`}
                  >
                    {tab === 'myStories' ? 'My Stories' : tab === 'contributions' ? 'My Contributions' : 'My Drafts'}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin h-16 w-16 border-8 border-black border-t-neo-blue rounded-none"></div>
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
                        <div className="text-center py-16 border-4 border-dashed border-gray-300">
                          <div className="text-6xl mb-6">📝</div>
                          <h3 className="text-2xl font-black text-black dark:text-white mb-2 uppercase">No stories yet</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-8 font-bold">You haven't created any stories yet. Start your journey today!</p>
                          <Link href="/stories/create" className="neo-btn-primary">
                            Create Your First Story
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        <div className="text-center py-16 border-4 border-dashed border-gray-300">
                          <div className="text-6xl mb-6">✍️</div>
                          <h3 className="text-2xl font-black text-black dark:text-white mb-2 uppercase">No contributions yet</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-8 font-bold">You haven't contributed to any stories yet. Browse stories to find one you like!</p>
                          <Link href="/stories" className="neo-btn-primary">
                            Browse Stories
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        <div className="text-center py-16 border-4 border-dashed border-gray-300">
                          <div className="text-6xl mb-6">📄</div>
                          <h3 className="text-2xl font-black text-black dark:text-white mb-2 uppercase">No drafts yet</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-8 font-bold">You don't have any saved drafts.</p>
                          <Link href="/stories" className="neo-btn-primary">
                            Browse Stories
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {myDrafts.map((draft) => (
                            <div key={draft._id} className="bg-white dark:bg-zinc-800 p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                              <h3 className="text-xl font-black text-black dark:text-white mb-3 line-clamp-1 uppercase bg-neo-yellow inline-block px-1 border-2 border-black">{draft.storyId?.title || 'Unknown Story'}</h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 font-medium bg-gray-100 dark:bg-black p-3 border-2 border-black border-dashed">{draft.content}</p>
                              <div className="flex justify-between items-center mt-4 border-t-2 border-black pt-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                  {new Date(draft.createdAt).toLocaleDateString()}
                                </span>
                                <Link href={`/stories/${draft.storyId?._id}`} className="text-neo-blue font-black hover:underline uppercase text-sm flex items-center gap-1 group">
                                  Continue Writing <span className="group-hover:translate-x-1 transition-transform">→</span>
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