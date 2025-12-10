import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { removeCollaborator, updateCollaboratorRole } from '../services/collaboratorService';

export default function CollaboratorList({ storyId, collaborators, creator, isCreator, onUpdate }) {
  const [updatingRole, setUpdatingRole] = useState(null);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRole(userId);
    try {
      await updateCollaboratorRole(storyId, userId, newRole);
      toast.success('Role updated successfully');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Role update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleRemove = async (userId, username) => {
    if (!confirm(`Remove ${username} from collaborators?`)) return;

    try {
      await removeCollaborator(storyId, userId);
      toast.success(`${username} removed from collaborators`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Remove collaborator error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'editor':
        return 'bg-purple-100 text-purple-700';
      case 'contributor':
        return 'bg-blue-100 text-blue-700';
      case 'viewer':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators</h3>

      {/* Creator */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
              {creator.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{creator.username}</p>
              <p className="text-sm text-gray-500">{creator.email}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Creator
          </span>
        </div>
      </div>

      {/* Collaborators */}
      <div className="space-y-3">
        {collaborators && collaborators.length > 0 ? (
          collaborators.map((collab) => (
            <motion.div
              key={collab.user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold">
                  {collab.user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{collab.user.username}</p>
                  <p className="text-sm text-gray-500">{collab.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCreator ? (
                  <>
                    <select
                      value={collab.role}
                      onChange={(e) => handleRoleChange(collab.user._id, e.target.value)}
                      disabled={updatingRole === collab.user._id}
                      className={`text-xs font-medium px-3 py-1 rounded-full border-0 cursor-pointer ${getRoleBadgeColor(collab.role)}`}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="contributor">Contributor</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={() => handleRemove(collab.user._id, collab.user.username)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Remove collaborator"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(collab.role)}`}>
                    {collab.role.charAt(0).toUpperCase() + collab.role.slice(1)}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No collaborators yet</p>
        )}
      </div>
    </div>
  );
}
