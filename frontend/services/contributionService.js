import api from '../utils/api';

// Create a contribution
export const createContribution = async (contributionData) => {
  const response = await api.post('/contributions', contributionData);
  return response.data;
};

// Get contributions for a story
export const getStoryContributions = async (storyId) => {
  const response = await api.get(`/contributions/story/${storyId}`);
  return response.data;
};

// Get user's drafts
export const getUserDrafts = async () => {
  const response = await api.get('/contributions/user/drafts');
  return response.data;
};

// Get user's draft for a specific story
export const getUserStoryDraft = async (storyId) => {
  const response = await api.get(`/contributions/story/${storyId}/draft`);
  return response.data;
};

// Update a contribution
export const updateContribution = async (id, contributionData) => {
  const response = await api.put(`/contributions/${id}`, contributionData);
  return response.data;
};

// Delete a contribution
export const deleteContribution = async (id) => {
  const response = await api.delete(`/contributions/${id}`);
  return response.data;
};

// Add a comment to a contribution
export const addComment = async (contributionId, commentData) => {
  const response = await api.post(`/contributions/${contributionId}/comments`, commentData);
  return response.data;
};