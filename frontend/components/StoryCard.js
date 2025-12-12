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
      whileHover={{ y: -4, x: -4 }}
      className="bg-white dark:bg-zinc-900 rounded-none shadow-neo hover:shadow-none border-2 border-black dark:border-white transition-all duration-200 flex flex-col h-full"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-neo-yellow text-black border-2 border-black">
            {story.genre}
          </span>
          {story.status === 'completed' && (
            <span className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-wider text-white bg-neo-green border-2 border-black">
              Completed
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-black dark:text-white mb-3 line-clamp-2">
          <Link href={`/stories/${story._id}`} className="hover:text-neo-blue decoration-4 hover:underline decoration-neo-blue transition-colors">
            {story.title}
          </Link>
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed font-medium">
          {descriptionPreview}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags && story.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs font-bold text-black bg-neo-off-white border-2 border-black px-2 py-1">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-neo-blue border-t-2 border-black flex items-center justify-between text-xs text-white font-bold">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center text-black font-bold mr-2 uppercase">
            {story.creator.username.charAt(0)}
          </div>
          <span className="font-bold text-sm">{story.creator.username}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center" title="Contributions">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>{story.contributions?.length || 0}</span>
          </div>
          <div className="flex items-center" title="Created">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
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