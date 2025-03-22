import Link from 'next/link';
import { formatDistanceToNow } from '../utils/dateUtils';

const StoryCard = ({ story }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
          <Link href={`/stories/${story._id}`}>{story.title}</Link>
        </h3>
        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
          {story.genre}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{story.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <span>By {story.creator.username}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <span>{story.contributions?.length || 0} contributions</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{formatDistanceToNow(story.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;