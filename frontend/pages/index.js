import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StoryCard from '../components/StoryCard';

export default function Home() {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedStories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stories?limit=6&sort=-createdAt`);
        setFeaturedStories(response.data.stories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured stories:', err);
        setError('Failed to load featured stories. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeaturedStories();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Collaborative Storytelling App</title>
        <meta name="description" content="Create and collaborate on stories with writers from around the world" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-b from-primary-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Collaborative Storytelling
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create and collaborate on stories with writers from around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/stories/create" className="btn-primary">
                Start a New Story
              </Link>
              <Link href="/stories" className="btn-outline">
                Browse Stories
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Loading stories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link href="/stories" className="btn-outline">
            View All Stories
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">Create</h3>
                <p className="text-gray-600">Start a new story with a title, description, and opening paragraph.</p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
                <p className="text-gray-600">Other writers can contribute to your story with their own paragraphs.</p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">Vote</h3>
                <p className="text-gray-600">Vote on contributions to determine which direction the story takes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}