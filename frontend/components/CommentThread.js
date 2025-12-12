import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { addComment } from '../services/contributionService';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function CommentThread({ contributionId, comments = [], onCommentAdded }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (newComment.length > 500) {
      toast.error('Comment cannot exceed 500 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addComment(contributionId, { text: newComment.trim() });
      setNewComment('');
      toast.success('Comment added');
      if (onCommentAdded) onCommentAdded(response.comment);
    } catch (error) {
      console.error('Comment error:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        {comments.length > 0 ? `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}` : 'Add comment'}
      </button>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4 border-l-4 border-black pl-4"
          >
            {/* Existing Comments */}
            {comments.length > 0 && (
              <div className="space-y-3">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-neo-off-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-black text-white border-2 border-black flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {comment.userId?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-black">
                            {comment.userId?.username || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500 font-mono bg-white px-1 border border-black">
                            {formatDistanceToNow(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words font-medium">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="input-field resize-none bg-white font-mono text-sm"
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-bold">
                  {newComment.length}/500
                </span>
                <button
                  type="submit"
                  className="neo-btn-primary text-sm py-1.5 px-4"
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
