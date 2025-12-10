import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Invite a collaborator
export const inviteCollaborator = async (storyId, email, role) => {
  const response = await axios.post(`${API_URL}/collaborators/invite`, {
    storyId,
    email,
    role,
  });
  return response.data;
};

// Accept an invite
export const acceptInvite = async (token) => {
  const response = await axios.post(`${API_URL}/collaborators/accept`, {
    token,
  });
  return response.data;
};

// Get collaborators for a story
export const getCollaborators = async (storyId) => {
  const response = await axios.get(`${API_URL}/collaborators/${storyId}`);
  return response.data;
};

// Remove a collaborator
export const removeCollaborator = async (storyId, userId) => {
  const response = await axios.delete(`${API_URL}/collaborators/${storyId}/${userId}`);
  return response.data;
};

// Update collaborator role
export const updateCollaboratorRole = async (storyId, userId, role) => {
  const response = await axios.put(`${API_URL}/collaborators/${storyId}/${userId}`, {
    role,
  });
  return response.data;
};
