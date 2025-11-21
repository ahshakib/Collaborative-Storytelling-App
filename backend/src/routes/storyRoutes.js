const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const storyController = require('../controllers/storyController');
const auth = require('../middleware/auth');

// @route   POST /api/stories
// @desc    Create a new story
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('title', 'Title must be between 3 and 100 characters').isLength({ min: 3, max: 100 }),
      check('description', 'Description is required').not().isEmpty(),
      check('description', 'Description must be less than 500 characters').isLength({ max: 500 }),
      check('genre', 'Genre is required').not().isEmpty(),
    ],
  ],
  storyController.createStory
);

// @route   GET /api/stories
// @desc    Get all stories with pagination and filters
// @access  Public (with private stories hidden)
router.get('/', storyController.getAllStories);

// @route   GET /api/stories/stats
// @desc    Get platform stats
// @access  Public
router.get('/stats', storyController.getStats);

// @route   GET /api/stories/:id
// @desc    Get a single story by ID
// @access  Public (with private check)
router.get('/:id', storyController.getStoryById);

// @route   PUT /api/stories/:id
// @desc    Update a story
// @access  Private (creator or admin only)
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title must be between 3 and 100 characters').optional().isLength({ min: 3, max: 100 }),
      check('description', 'Description must be less than 500 characters').optional().isLength({ max: 500 }),
    ],
  ],
  storyController.updateStory
);

// @route   DELETE /api/stories/:id
// @desc    Delete a story
// @access  Private (creator or admin only)
router.delete('/:id', auth, storyController.deleteStory);

// @route   POST /api/stories/:id/like
// @desc    Like a story
// @access  Private
router.post('/:id/like', auth, storyController.likeStory);

module.exports = router;