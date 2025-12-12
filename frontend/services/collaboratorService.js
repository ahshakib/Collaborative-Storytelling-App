import api from '../utils/api';

// Invite a collaborator
export const inviteCollaborator = async (storyId, email, role) => {
  const response = await api.post('/collaborators/invite', {
    storyId,
    email,
    role,
  });
  return response.data;
};

// Accept an invite
export const acceptInvite = async (token) => {
  const response = await api.post('/collaborators/accept', {
    token,
  });
  return response.data;
};

// Get collaborators for a story
export const getCollaborators = async (storyId) => {
  const response = await api.get(`/collaborators/${storyId}`);
  return response.data;
};

// Remove a collaborator
export const removeCollaborator = async (storyId, userId) => {
  const response = await api.delete(`/collaborators/${storyId}/${userId}`);
  return response.data;
};

// Update collaborator role
export const updateCollaboratorRole = async (storyId, userId, role) => {
  const response = await api.put(`/collaborators/${storyId}/${userId}`, {
    role,
  });
  return response.data;
};
