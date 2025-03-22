import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { createStory } from '../../services/storyService';
import toast from 'react-hot-toast';

export default function CreateStory() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    tags: '',
    isPrivate: false,
    maxContributors: 0,
    contributionTimeLimit: 0,
  });

  // Redirect if not authenticated
  if (typeof window !== 'undefined' && !isAuthenticated && !user) {
    router.push('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTagsChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim())
        : [];

      // Prepare data for API
      const storyData = {
        ...formData,
        tags: tagsArray,
      };

      const response = await createStory(storyData);
      toast.success('Story created successfully!');
      router.push(`/stories/${response.story._id}`);
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error(error.response?.data?.message || 'Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create a New Story | Collaborative Storytelling">
      <Head>
        <title>Create a New Story | Collaborative Storytelling</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Story</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
                minLength={3}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">Between 3 and 100 characters</p>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows={3}
                required
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
            </div>

            <div className="mb-4">
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="" disabled>
                  Select a genre
                </option>
                <option value="Fantasy">Fantasy</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Horror">Horror</option>
                <option value="Romance">Romance</option>
                <option value="Adventure">Adventure</option>
                <option value="Thriller">Thriller</option>
                <option value="Historical Fiction">Historical Fiction</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleTagsChange}
                className="input-field"
                placeholder="Enter tags separated by commas"
              />
              <p className="text-xs text-gray-500 mt-1">Optional. Example: fantasy, magic, dragons</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="isPrivate"
                  name="isPrivate"
                  type="checkbox"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                  Make this story private
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-6">Private stories are only visible to you and invited contributors</p>
            </div>

            <div className="mb-4">
              <label htmlFor="maxContributors" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Contributors
              </label>
              <input
                id="maxContributors"
                name="maxContributors"
                type="number"
                min="0"
                value={formData.maxContributors}
                onChange={handleChange}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 for unlimited contributors</p>
            </div>

            <div className="mb-6">
              <label htmlFor="contributionTimeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                Contribution Time Limit (hours)
              </label>
              <input
                id="contributionTimeLimit"
                name="contributionTimeLimit"
                type="number"
                min="0"
                value={formData.contributionTimeLimit}
                onChange={handleChange}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 for no time limit</p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Story...' : 'Create Story'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}