import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';

const StoryCard = ({ story }) => {
  // Function to strip HTML tags for description preview
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Safe description preview
  const descriptionPreview = typeof window !== 'undefined' 
    ? stripHtml(story.description) 
    : story.description?.replace(/<[^>]*>?/gm, '') || '';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-50 text-primary-700 border border-primary-100">
            {story.genre}
          </span>
          {story.status === 'completed' && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded text-green-700 bg-green-50">
              Completed
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
          <Link href={`/stories/${story._id}`} className="hover:text-primary-600 transition-colors">
            {story.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {descriptionPreview}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags && story.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold mr-2">
            {story.creator.username.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{story.creator.username}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center" title="Contributions">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>{story.contributions?.length || 0}</span>
          </div>
          <div className="flex items-center" title="Created">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoryCard;