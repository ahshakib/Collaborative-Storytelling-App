import axios from 'axios';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ stories: 0, writers: 0 });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFeaturedStories = async () => {
      try {
        // Fetch popular stories based on votes/contributions
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stories?limit=6&sort=-votes`);
        setFeaturedStories(response.data.stories);
        
        // Fetch real stats
        const statsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stories/stats`);
        setStats(statsResponse.data.stats);
        
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
              Weave Stories <span className="text-yellow-300">Together</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto"
            >
              Join a community of writers. Start a story, contribute to others, and watch your imagination come to life.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/stories/create" className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
                Start Writing
              </Link>
              <Link href="/stories" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105">
                Read Stories
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Banner */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-12 md:gap-24 text-center">
              <div>
                <p className="text-3xl font-bold">{stats.stories}+</p>
                <p className="text-primary-200 text-sm uppercase tracking-wider">Stories Created</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.writers}+</p>
                <p className="text-primary-200 text-sm uppercase tracking-wider">Active Writers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <h2 className="text-3xl font-bold text-gray-900">Trending Stories</h2>
            </div>
            <p className="text-gray-600">The most popular adventures happening right now.</p>
          </div>
          <Link href="/stories" className="hidden md:flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            View All Stories 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Trending Badge */}
                <div className="absolute -top-3 -right-3 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-12">
                  Trending
                </div>
                <StoryCard story={story} />
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12 md:hidden">
          <Link href="/stories" className="btn-outline w-full block">
            View All Stories
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Collaborative storytelling is easy, fun, and rewarding.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Create',
                description: 'Start a new story with a title, description, and opening paragraph. Set the genre and rules.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                delay: 0.2
              },
              {
                title: 'Collaborate',
                description: 'Other writers can contribute to your story. Each contribution adds a new twist to the plot.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                delay: 0.3
              },
              {
                title: 'Vote',
                description: 'The community votes on contributions. The best ideas become part of the official story.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay, duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 transform hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          {!isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center mt-16"
            >
              <Link href="/register" className="btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl">
                Get Started Now
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}