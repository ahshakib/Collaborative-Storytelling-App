const express = require('express');
const router = express.Router();
const collaboratorController = require('../controllers/collaboratorController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Invite a collaborator
router.post(
  '/invite',
  protect,
  [
    check('email', 'Please include a valid email').isEmail(),
    check('storyId', 'Story ID is required').not().isEmpty(),
  ],
  collaboratorController.inviteCollaborator
);

// Accept an invite
router.post(
  '/accept',
  protect,
  [check('token', 'Token is required').not().isEmpty()],
  collaboratorController.acceptInvite
);

// Get collaborators for a story
router.get('/:storyId', protect, collaboratorController.getCollaborators);

// Remove a collaborator
router.delete('/:storyId/:userId', protect, collaboratorController.removeCollaborator);

// Update collaborator role
router.put(
  '/:storyId/:userId',
  protect,
  [check('role', 'Role is required').isIn(['editor', 'contributor', 'viewer'])],
  collaboratorController.updateCollaboratorRole
);

module.exports = router;
