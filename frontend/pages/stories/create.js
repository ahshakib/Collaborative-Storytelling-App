import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { storyTemplates } from '../../data/templates';
import { createStory } from '../../services/storyService';

// Import ReactQuill dynamically for client-side only
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value,
    });
  };

  const handleTemplateSelect = (template) => {
    // Map template IDs to existing genres
    const genreMap = {
      'mystery': 'Mystery',
      'scifi': 'Science Fiction',
      'fantasy': 'Fantasy',
      'romance': 'Romance',
      'horror': 'Horror'
    };

    setFormData({
      ...formData,
      genre: genreMap[template.id] || 'Other',
      description: template.content
    });
    toast.success(`Applied ${template.name} template!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || formData.description.replace(/<[^>]*>/g, '').trim().length === 0) {
      toast.error('Please provide a story description/opening.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(tag => tag.length > 0)
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Horror', 'Romance', 
    'Adventure', 'Thriller', 'Historical Fiction', 'Comedy', 'Drama', 'Other'
  ];

  return (
    <Layout title="Create a New Story | StoryCollab">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a New Adventure</h1>
              <p className="text-gray-600">Create the foundation for a story that others will help you build.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8">
                {/* Template Selection */}
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 text-sm">✨</span>
                    Start with a Template (Optional)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-11">
                    {storyTemplates.map((template) => (
                      <div 
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all group"
                      >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{template.icon}</div>
                        <h3 className="font-bold text-gray-800 mb-1">{template.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100 my-8" />

                {/* Basic Info Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 text-sm">1</span>
                    Story Details
                  </h2>
                  
                  <div className="space-y-6 pl-11">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Story Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="input-field text-lg font-medium"
                        placeholder="Enter a captivating title..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                          Genre <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="genre"
                          name="genre"
                          value={formData.genre}
                          onChange={handleChange}
                          required
                          className="input-field"
                        >
                          <option value="">Select a genre</option>
                          {genres.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <input
                          type="text"
                          id="tags"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="magic, dragons, space (comma separated)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100 my-8" />

                {/* Content Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 text-sm">2</span>
                    The Beginning
                  </h2>
                  
                  <div className="pl-11">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Paragraph/Description <span className="text-red-500">*</span>
                    </label>
                    <div className="prose-editor">
                      <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        modules={modules}
                        className="bg-white rounded-lg"
                        placeholder="Set the scene... Once upon a time..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Write an engaging opening to inspire other contributors.
                    </p>
                  </div>
                </div>

                <hr className="border-gray-100 my-8" />

                {/* Settings Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 text-sm">3</span>
                    Settings
                  </h2>
                  
                  <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="maxContributors" className="block text-sm font-medium text-gray-700 mb-1">
                        Max Contributors
                      </label>
                      <input
                        type="number"
                        id="maxContributors"
                        name="maxContributors"
                        value={formData.maxContributors}
                        onChange={handleChange}
                        min="0"
                        className="input-field"
                      />
                      <p className="text-xs text-gray-500 mt-1">0 for unlimited</p>
                    </div>

                    <div>
                      <label htmlFor="contributionTimeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                        Time Limit (hours)
                      </label>
                      <input
                        type="number"
                        id="contributionTimeLimit"
                        name="contributionTimeLimit"
                        value={formData.contributionTimeLimit}
                        onChange={handleChange}
                        min="0"
                        className="input-field"
                      />
                      <p className="text-xs text-gray-500 mt-1">0 for no limit</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          name="isPrivate"
                          checked={formData.isPrivate}
                          onChange={handleChange}
                          className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900 block">Make Private</span>
                          <span className="text-xs text-gray-500 block">Only people with the link can join</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="mr-4 px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary px-8 py-3 text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:-translate-y-0.5 transition-all"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Story'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}