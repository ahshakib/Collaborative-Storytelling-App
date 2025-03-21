const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const voteController = require('../controllers/voteController');
const auth = require('../middleware/auth');

// @route   POST /api/votes
// @desc    Create or update a vote
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('contributionId', 'Contribution ID is required').not().isEmpty(),
      check('voteType', 'Vote type must be either upvote or downvote').isIn(['upvote', 'downvote']),
    ],
  ],
  voteController.createVote
);

// @route   GET /api/votes/contribution/:contributionId
// @desc    Get all votes for a contribution
// @access  Public
router.get('/contribution/:contributionId', voteController.getContributionVotes);

// @route   GET /api/votes/user/contribution/:contributionId
// @desc    Get user's vote for a contribution
// @access  Private
router.get('/user/contribution/:contributionId', auth, voteController.getUserVote);

module.exports = router;