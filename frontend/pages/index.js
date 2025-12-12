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
      <div className="relative bg-neo-blue text-white overflow-hidden border-b-4 border-black">
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="text-6xl md:text-8xl font-black mb-6 leading-tight uppercase tracking-tighter"
            >
              Weave Stories <br/>
              <span className="text-black bg-neo-yellow px-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-2">Together</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl font-bold text-white mb-10 max-w-2xl mx-auto bg-black inline-block p-2 border-2 border-white transform rotate-1"
            >
              Join a community of writers. Start a story, contribute to others, and watch your imagination come to life.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/stories/create" className="neo-btn-primary text-xl px-10 py-4 bg-neo-green text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all font-black uppercase">
                Start Writing
              </Link>
              <Link href="/stories" className="text-xl px-10 py-4 bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all font-black uppercase">
                Read Stories
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Stats Banner */}
        <div className="bg-neo-yellow border-t-4 border-black py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-12 md:gap-24 text-center">
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3">
                <p className="text-4xl font-black text-black">{stats.stories}+</p>
                <p className="text-black text-sm font-bold uppercase tracking-wider">Stories Created</p>
              </div>
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
                <p className="text-4xl font-black text-black">{stats.writers}+</p>
                <p className="text-black text-sm font-bold uppercase tracking-wider">Active Writers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-12 border-b-4 border-black pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🔥</span>
              <h2 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter">Trending Stories</h2>
            </div>
            <p className="text-black dark:text-white font-bold text-lg bg-neo-yellow inline-block px-2 border-2 border-black">The most popular adventures happening right now.</p>
          </div>
          <Link href="/stories" className="hidden md:flex items-center bg-neo-red text-white border-2 border-black px-4 py-2 font-bold hover:bg-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
            VIEW ALL STORIES 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-16 w-16 border-8 border-black border-t-neo-yellow rounded-none"></div>
          </div>
        ) : error ? (
          <div className="bg-neo-red text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center font-bold text-xl">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                className="relative"
              >
                {/* Trending Badge */}
                <div className="absolute -top-4 -right-4 z-10 bg-neo-yellow text-black text-sm font-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-12">
                  TRENDING
                </div>
                <StoryCard story={story} />
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12 md:hidden">
          <Link href="/stories" className="w-full block bg-white text-black border-4 border-black font-black uppercase py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            View All Stories
          </Link>
        </div>
      </div>

      <div className="bg-neo-off-white dark:bg-zinc-900 py-24 border-t-4 border-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-5xl font-black text-black dark:text-white mb-6 uppercase tracking-tighter"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-black inline-block px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1"
            >
              Collaborative storytelling is easy, fun, and rewarding.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'CREATE',
                description: 'Start a new story with a title, description, and opening paragraph. Set the genre and rules.',
                color: 'bg-neo-blue',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                delay: 0.2
              },
              {
                title: 'COLLABORATE',
                description: 'Other writers can contribute to your story. Each contribution adds a new twist to the plot.',
                color: 'bg-neo-red',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                delay: 0.3
              },
              {
                title: 'VOTE',
                description: 'The community votes on contributions. The best ideas become part of the official story.',
                color: 'bg-neo-green',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotate: index % 2 === 0 ? 2 : -2, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
                transition={{ delay: step.delay, duration: 0.4 }}
                className="bg-white dark:bg-zinc-800 p-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transition-all duration-200"
              >
                <div className={`w-20 h-20 ${step.color} border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  {step.icon}
                </div>
                <h3 className="text-3xl font-black mb-4 text-black dark:text-white uppercase tracking-tight">{step.title}</h3>
                <p className="text-gray-800 dark:text-gray-200 font-bold leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          {!isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center mt-20"
            >
              <Link href="/register" className="bg-neo-yellow text-black text-2xl font-black px-12 py-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all uppercase inline-block transform rotate-2">
                Get Started Now
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}