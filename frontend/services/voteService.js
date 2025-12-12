import api from '../utils/api';

/**
 * Create or update a vote
 * @param {Object} voteData - Vote data (contributionId and voteType)
 * @returns {Promise} - API response
 */
export const createVote = async (voteData) => {
  const response = await api.post('/votes', voteData);
  return response.data;
};

/**
 * Get all votes for a contribution
 * @param {string} contributionId - Contribution ID
 * @returns {Promise} - API response
 */
export const getContributionVotes = async (contributionId) => {
  const response = await api.get(`/votes/contribution/${contributionId}`);
  return response.data;
};

/**
 * Get user's vote for a contribution
 * @param {string} contributionId - Contribution ID
 * @returns {Promise} - API response
 */
export const getUserVote = async (contributionId) => {
  const response = await api.get(`/votes/user/contribution/${contributionId}`);
  return response.data;
};