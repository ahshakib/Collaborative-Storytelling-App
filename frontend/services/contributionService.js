import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create a contribution
export const createContribution = async (contributionData) => {
  const response = await axios.post(`${API_URL}/contributions`, contributionData);
  return response.data;
};

// Get contributions for a story
export const getStoryContributions = async (storyId) => {
  const response = await axios.get(`${API_URL}/contributions/story/${storyId}`);
  return response.data;
};

// Get user's drafts
export const getUserDrafts = async () => {
  const response = await axios.get(`${API_URL}/contributions/user/drafts`);
  return response.data;
};

// Get user's draft for a specific story
export const getUserStoryDraft = async (storyId) => {
  const response = await axios.get(`${API_URL}/contributions/story/${storyId}/draft`);
  return response.data;
};

// Update a contribution
export const updateContribution = async (id, contributionData) => {
  const response = await axios.put(`${API_URL}/contributions/${id}`, contributionData);
  return response.data;
};

// Delete a contribution
export const deleteContribution = async (id) => {
  const response = await axios.delete(`${API_URL}/contributions/${id}`);
  return response.data;
};

// Add a comment to a contribution
export const addComment = async (contributionId, commentData) => {
  const response = await axios.post(`${API_URL}/contributions/${contributionId}/comments`, commentData);
  return response.data;
};