const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const contributionController = require('../controllers/contributionController');
const auth = require('../middleware/auth');

// @route   POST /api/contributions
// @desc    Create a new contribution
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('storyId', 'Story ID is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
      check('content', 'Content must be between 10 and 5000 characters').isLength({ min: 10, max: 5000 }),
    ],
  ],
  contributionController.createContribution
);

// @route   GET /api/contributions/story/:storyId
// @desc    Get all contributions for a story
// @access  Public (with private check)
router.get('/story/:storyId', contributionController.getStoryContributions);

// @route   GET /api/contributions/:id
// @desc    Get a single contribution by ID
// @access  Public (with private check)
router.get('/:id', contributionController.getContributionById);

// @route   PUT /api/contributions/:id
// @desc    Update a contribution
// @access  Private (author or admin only)
router.put(
  '/:id',
  [
    auth,
    [
      check('content', 'Content must be between 10 and 5000 characters').optional().isLength({ min: 10, max: 5000 }),
    ],
  ],
  contributionController.updateContribution
);

// @route   DELETE /api/contributions/:id
// @desc    Delete a contribution
// @access  Private (author or admin only)
router.delete('/:id', auth, contributionController.deleteContribution);

// @route   POST /api/contributions/:id/comments
// @desc    Add a comment to a contribution
// @access  Private
router.post(
  '/:id/comments',
  [
    auth,
    [
      check('text', 'Comment text is required').not().isEmpty(),
      check('text', 'Comment cannot exceed 500 characters').isLength({ max: 500 }),
    ],
  ],
  contributionController.addComment
);

// @route   POST /api/contributions/:id/select
// @desc    Select a contribution for the main storyline
// @access  Private (story creator or admin only)
router.post('/:id/select', auth, contributionController.selectContribution);

module.exports = router;