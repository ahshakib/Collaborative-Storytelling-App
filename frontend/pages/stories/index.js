import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import StoryCard from '../../components/StoryCard';
import { getAllStories } from '../../services/storyService';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    status: '',
    sort: '-createdAt',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalPages: 1,
  });

  const genres = [
    'All',
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Horror',
    'Romance',
    'Adventure',
    'Thriller',
    'Historical Fiction',
    'Comedy',
    'Drama',
    'Other',
  ];

  const statuses = ['All', 'active', 'completed', 'archived'];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-votes', label: 'Most Popular' },
    { value: '-contributions', label: 'Most Contributions' },
  ];

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: filters.sort,
      };

      if (filters.search) {
        params.title = filters.search; // Assuming backend supports title search
      }

      if (filters.genre && filters.genre !== 'All') {
        params.genre = filters.genre;
      }

      if (filters.status && filters.status !== 'All') {
        params.status = filters.status;
      }

      const response = await getAllStories(params);
      setStories(response.stories);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(response.totalStories / prev.limit),
      }));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories. Please try again later.');
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStories();
    }, 500); // Debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [fetchStories]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Layout title="Browse Stories | StoryCollab">
      <Head>
        <title>Browse Stories | StoryCollab</title>
      </Head>

      <div className="bg-neo-off-white dark:bg-zinc-900 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 border-b-4 border-black pb-8">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl md:text-7xl font-black text-black dark:text-white mb-6 uppercase tracking-tighter"
            >
              Explore <span className="text-white bg-neo-blue px-4 border-4 border-black inline-block transform -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Stories</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-gray-700 dark:text-gray-300 max-w-2xl mx-auto bg-white dark:bg-black p-2 border-2 border-black inline-block transform rotate-1"
            >
              Discover worlds created by our community, or start your own adventure.
            </motion.p>
          </div>

          {/* Filters Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-neo-yellow border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-4 lg:col-span-1">
                <label htmlFor="search" className="block text-sm font-black uppercase mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    className="neo-input w-full pl-10"
                    placeholder="FIND A STORY..."
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-black uppercase mb-1">
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  className="neo-input w-full cursor-pointer"
                  value={filters.genre}
                  onChange={handleFilterChange}
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre === 'All' ? '' : genre}>
                      {genre.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-black uppercase mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="neo-input w-full cursor-pointer"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status === 'All' ? '' : status}>
                      {status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sort" className="block text-sm font-black uppercase mb-1">
                  Sort By
                </label>
                <select
                  id="sort"
                  name="sort"
                  className="neo-input w-full cursor-pointer"
                  value={filters.sort}
                  onChange={handleFilterChange}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Stories Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-16 w-16 border-8 border-black border-t-neo-red rounded-none"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-neo-red text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold text-xl">{error}</p>
            </div>
          ) : stories.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white border-4 border-dashed border-gray-400"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-black text-black mb-2 uppercase">No stories found</h3>
              <p className="text-gray-600 font-bold mb-6">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => setFilters({ search: '', genre: '', status: '', sort: '-createdAt' })}
                className="neo-btn-primary bg-neo-blue text-white"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {stories.map((story) => (
                  <StoryCard key={story._id} story={story} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {!loading && !error && stories.length > 0 && (
            <div className="flex justify-center mt-16">
              <nav className="flex items-center space-x-4 bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-6 py-2 border-2 border-black font-black uppercase text-sm transition-all ${
                    pagination.page === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-white hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex space-x-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - pagination.page) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                    
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsisBefore && <span className="px-2 font-black">...</span>}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 border-2 border-black font-black text-sm transition-all ${
                            pagination.page === page 
                              ? 'bg-neo-yellow text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                        {showEllipsisAfter && <span className="px-2 font-black">...</span>}
                      </div>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-6 py-2 border-2 border-black font-black uppercase text-sm transition-all ${
                    pagination.page === pagination.totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-white hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}