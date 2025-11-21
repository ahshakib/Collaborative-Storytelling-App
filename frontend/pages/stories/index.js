import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStories();
    }, 500); // Debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [filters, pagination.page]);

  const fetchStories = async () => {
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
      setPagination({
        ...pagination,
        totalPages: Math.ceil(response.totalStories / pagination.limit),
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories. Please try again later.');
      setLoading(false);
    }
  };

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

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold text-gray-900 mb-4"
            >
              Explore Stories
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Discover worlds created by our community, or start your own adventure.
            </motion.p>
          </div>

          {/* Filters Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-4 lg:col-span-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    className="input-field pl-10"
                    placeholder="Search stories..."
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  className="input-field"
                  value={filters.genre}
                  onChange={handleFilterChange}
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre === 'All' ? '' : genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="input-field"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status === 'All' ? '' : status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sort"
                  name="sort"
                  className="input-field"
                  value={filters.sort}
                  onChange={handleFilterChange}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Stories Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100 text-red-600">
              <p>{error}</p>
            </div>
          ) : stories.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No stories found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => setFilters({ search: '', genre: '', status: '', sort: '-createdAt' })}
                className="btn-outline"
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
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pagination.page === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  Previous
                </button>
                
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
                        {showEllipsisBefore && <span className="px-2 text-gray-400">...</span>}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-md text-sm font-medium transition-all ${
                            pagination.page === page 
                              ? 'bg-primary-600 text-white shadow-md' 
                              : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                          }`}
                        >
                          {page}
                        </button>
                        {showEllipsisAfter && <span className="px-2 text-gray-400">...</span>}
                      </div>
                    );
                  })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pagination.page === pagination.totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
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