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
    <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white p-6 shadow-neo">
      <h3 className="text-lg font-bold uppercase tracking-wider text-black dark:text-white mb-4 border-b-2 border-black pb-2">Collaborators</h3>

      {/* Creator */}
      <div className="mb-4 pb-4 border-b-2 border-black border-dashed">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-blue border-2 border-black flex items-center justify-center text-white font-bold text-lg">
              {creator.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-black dark:text-white">{creator.username}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{creator.email}</p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-neo-yellow text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between py-2 hover:bg-neo-off-white dark:hover:bg-zinc-800 transition-colors p-2 border-2 border-transparent hover:border-black"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 border-2 border-black flex items-center justify-center text-black dark:text-white font-bold">
                  {collab.user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-black dark:text-white">{collab.user.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{collab.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCreator ? (
                  <>
                    <select
                      value={collab.role}
                      onChange={(e) => handleRoleChange(collab.user._id, e.target.value)}
                      disabled={updatingRole === collab.user._id}
                      className={`text-xs font-bold uppercase tracking-wide px-3 py-1 border-2 border-black cursor-pointer bg-white text-black focus:shadow-neo focus:outline-none`}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="contributor">Contributor</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={() => handleRemove(collab.user._id, collab.user.username)}
                      className="text-neo-red hover:bg-neo-red hover:text-white border-2 border-transparent hover:border-black p-1 transition-all"
                      title="Remove collaborator"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black ${
                    collab.role === 'editor' ? 'bg-neo-blue text-white' : 
                    collab.role === 'contributor' ? 'bg-neo-green text-white' : 
                    'bg-gray-200 text-black'
                  }`}>
                    {collab.role}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 font-medium text-center py-4 italic border-2 border-dashed border-gray-300">No collaborators yet</p>
        )}
      </div>
    </div>
  );
}
