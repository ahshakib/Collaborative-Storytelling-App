import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';
import { getAllStories } from '../services/storyService';

export default function Dashboard() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('myStories');
  const [myStories, setMyStories] = useState([]);
  const [myContributions, setMyContributions] = useState([]);
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
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard | Collaborative Storytelling">
      <Head>
        <title>Dashboard | Collaborative Storytelling</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Your Dashboard</h1>
          <Link href="/stories/create" className="btn-primary">
            Create New Story
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('myStories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'myStories' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                My Stories
              </button>
              <button
                onClick={() => setActiveTab('contributions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contributions' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                My Contributions
              </button>
            </nav>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading your stories...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'myStories' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Stories You Created</h2>
                {myStories.length === 0 ? (
                  <div className="card p-8 text-center">
                    <p className="text-gray-600 mb-4">You haven't created any stories yet.</p>
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
              </div>
            )}

            {activeTab === 'contributions' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Stories You Contributed To</h2>
                {myContributions.length === 0 ? (
                  <div className="card p-8 text-center">
                    <p className="text-gray-600 mb-4">You haven't contributed to any stories yet.</p>
                    <Link href="/stories" className="btn-primary">
                      Browse Stories to Contribute
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myContributions.map((story) => (
                      <StoryCard key={story._id} story={story} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}