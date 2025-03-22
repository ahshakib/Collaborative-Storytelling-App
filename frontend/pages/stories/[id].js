import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { createContribution, getStoryContributions } from '../../services/contributionService';
import { getStoryById } from '../../services/storyService';
import { createVote, getUserVote } from '../../services/voteService';
import { formatDistanceToNow } from '../../utils/dateUtils';

export default function StoryDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, user } = useAuth();
  
  const [story, setStory] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContribution, setNewContribution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    if (id) {
      fetchStory();
    }
  }, [id]);

  const fetchStory = async () => {
    setLoading(true);
    try {
      // Fetch story details
      const storyData = await getStoryById(id);
      setStory(storyData.story);
      
      // Fetch contributions
      const contributionsData = await getStoryContributions(id);
      setContributions(contributionsData.contributions);
      
      // If user is authenticated, fetch their votes for each contribution
      if (isAuthenticated && user) {
        const votesObj = {};
        for (const contribution of contributionsData.contributions) {
          try {
            const voteData = await getUserVote(contribution._id);
            if (voteData.vote) {
              votesObj[contribution._id] = voteData.vote.voteType;
            }
          } catch (err) {
            // No vote found for this contribution
            console.log('No vote found for contribution:', contribution._id);
          }
        }
        setUserVotes(votesObj);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching story:', err);
      setError('Failed to load story. Please try again later.');
      setLoading(false);
    }
  };

  const handleContributionChange = (e) => {
    setNewContribution(e.target.value);
  };

  const handleSubmitContribution = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to contribute to stories');
      router.push('/login');
      return;
    }
    
    if (newContribution.trim().length < 10) {
      toast.error('Contribution must be at least 10 characters long');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const contributionData = {
        storyId: id,
        content: newContribution.trim(),
      };
      
      const response = await createContribution(contributionData);
      
      // Add the new contribution to the list
      setContributions([...contributions, response.contribution]);
      
      // Clear the form
      setNewContribution('');
      
      toast.success('Contribution submitted successfully!');
    } catch (err) {
      console.error('Error submitting contribution:', err);
      toast.error(err.response?.data?.message || 'Failed to submit contribution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (contributionId, voteType) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to vote');
      router.push('/login');
      return;
    }
    
    try {
      // If user already voted the same way, remove their vote
      const currentVote = userVotes[contributionId];
      const newVoteType = currentVote === voteType ? null : voteType;
      
      const voteData = {
        contributionId,
        voteType: newVoteType,
      };
      
      await createVote(voteData);
      
      // Update local state
      if (newVoteType) {
        setUserVotes({ ...userVotes, [contributionId]: newVoteType });
      } else {
        const updatedVotes = { ...userVotes };
        delete updatedVotes[contributionId];
        setUserVotes(updatedVotes);
      }
      
      // Update contribution vote count
      const updatedContributions = contributions.map(contribution => {
        if (contribution._id === contributionId) {
          const votes = { ...contribution.votes };
          
          // If removing a vote
          if (currentVote && !newVoteType) {
            if (currentVote === 'upvote') votes.upvotes--;
            else if (currentVote === 'downvote') votes.downvotes--;
          }
          // If changing a vote
          else if (currentVote && newVoteType) {
            if (currentVote === 'upvote') {
              votes.upvotes--;
              votes.downvotes++;
            } else {
              votes.downvotes--;
              votes.upvotes++;
            }
          }
          // If adding a new vote
          else if (!currentVote && newVoteType) {
            if (newVoteType === 'upvote') votes.upvotes++;
            else if (newVoteType === 'downvote') votes.downvotes++;
          }
          
          return { ...contribution, votes };
        }
        return contribution;
      });
      
      setContributions(updatedContributions);
      
      toast.success(newVoteType ? 'Vote recorded!' : 'Vote removed!');
    } catch (err) {
      console.error('Error voting:', err);
      toast.error('Failed to record vote. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout title="Loading Story | Collaborative Storytelling">
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading story...</p>
        </div>
      </Layout>
    );
  }

  if (error || !story) {
    return (
      <Layout title="Error | Collaborative Storytelling">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500">{error || 'Story not found'}</p>
          <Link href="/stories" className="btn-primary mt-4">
            Back to Stories
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${story.title} | Collaborative Storytelling`}>
      <Head>
        <title>{story.title} | Collaborative Storytelling</title>
        <meta name="description" content={story.description} />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/stories" className="text-primary-600 hover:text-primary-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Stories
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{story.title}</h1>
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
              {story.genre}
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">{story.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {story.tags && story.tags.map((tag, index) => (
              <span key={index} className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
            <div className="flex items-center">
              <span>Created by {story.creator.username}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>{story.views} views</span>
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

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contributions</h2>
          
          {contributions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No contributions yet. Be the first to contribute!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {contributions.map((contribution) => (
                <div key={contribution._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{contribution.content}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <button 
                          onClick={() => handleVote(contribution._id, 'upvote')}
                          className={`p-1 rounded-full ${userVotes[contribution._id] === 'upvote' ? 'text-green-600 bg-green-100' : 'text-gray-400 hover:text-green-600'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                        </button>
                        <span className="ml-1">{contribution.votes?.upvotes || 0}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleVote(contribution._id, 'downvote')}
                          className={`p-1 rounded-full ${userVotes[contribution._id] === 'downvote' ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-red-600'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                          </svg>
                        </button>
                        <span className="ml-1">{contribution.votes?.downvotes || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <span>By {contribution.userId.username}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDistanceToNow(contribution.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Contribution Form */}
        {story.status === 'active' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Your Contribution</h2>
            
            {!isAuthenticated ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">You need to be logged in to contribute to this story.</p>
                <Link href="/login" className="btn-primary">
                  Log In to Contribute
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmitContribution}>
                <div className="mb-4">
                  <label htmlFor="contribution" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Contribution <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contribution"
                    name="contribution"
                    rows={6}
                    value={newContribution}
                    onChange={handleContributionChange}
                    className="input-field"
                    placeholder="Continue the story..."
                    required
                    minLength={10}
                    maxLength={5000}
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">Between 10 and 5000 characters</p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Contribution'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        
        {story.status !== 'active' && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">
              {story.status === 'completed' ? 'This story has been completed and is no longer accepting contributions.' : 'This story has been archived and is no longer accepting contributions.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}