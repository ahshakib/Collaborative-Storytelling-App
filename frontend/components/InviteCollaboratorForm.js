import { useState } from 'react';
import toast from 'react-hot-toast';
import { inviteCollaborator } from '../services/collaboratorService';

export default function InviteCollaboratorForm({ storyId, onInviteSuccess }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('contributor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await inviteCollaborator(storyId, email, role);
      toast.success(`Invite sent to ${email}`);
      setEmail('');
      setRole('contributor');
      if (onInviteSuccess) onInviteSuccess();
    } catch (error) {
      console.error('Invite error:', error);
      toast.error(error.response?.data?.message || 'Failed to send invite');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Collaborator</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="Enter email address"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field"
            disabled={isSubmitting}
          >
            <option value="viewer">Viewer - Can only view the story</option>
            <option value="contributor">Contributor - Can add contributions</option>
            <option value="editor">Editor - Can edit story details</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Invite'}
        </button>
      </div>
    </form>
  );
}
