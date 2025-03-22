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
    fetchStories();
  }, [filters, pagination.page]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: filters.sort,
      };

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
    }
  };

  return (
    <Layout title="Browse Stories | Collaborative Storytelling">
      <Head>
        <title>Browse Stories | Collaborative Storytelling</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Stories</h1>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {loading ? (
          <div className="text-center py-12">
            <p>Loading stories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <p>No stories found. Try adjusting your filters or create a new story!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && stories.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-md ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show current page, first and last page, and pages around current page
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.page) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis where pages are skipped
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                  
                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsisBefore && <span className="px-2">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${pagination.page === page ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {page}
                      </button>
                      {showEllipsisAfter && <span className="px-2">...</span>}
                    </div>
                  );
                })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`px-3 py-1 rounded-md ${pagination.page === pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </Layout>
  );
}