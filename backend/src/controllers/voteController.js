const Vote = require('../models/voteModel');
const Contribution = require('../models/contributionModel');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// Create or update a vote
exports.createVote = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { contributionId, voteType } = req.body;

    // Check if contribution exists
    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }

    // Check if user has already voted on this contribution
    const existingVote = await Vote.findOne({
      contributionId,
      userId: req.user.id,
    });

    if (existingVote) {
      // If vote type is the same, remove the vote (toggle)
      if (existingVote.voteType === voteType) {
        // Update contribution vote count
        if (voteType === 'upvote') {
          contribution.votes.upvotes -= 1;
        } else {
          contribution.votes.downvotes -= 1;
        }
        await contribution.save();

        // Remove vote from user's votes array
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { votes: existingVote._id },
        });

        // Delete the vote
        await Vote.findByIdAndDelete(existingVote._id);

        return res.status(200).json({
          success: true,
          message: 'Vote removed successfully',
          votes: contribution.votes,
        });
      }

      // If vote type is different, update the vote
      // First, update the contribution vote count
      if (existingVote.voteType === 'upvote') {
        contribution.votes.upvotes -= 1;
        contribution.votes.downvotes += 1;
      } else {
        contribution.votes.downvotes -= 1;
        contribution.votes.upvotes += 1;
      }
      await contribution.save();

      // Update the vote type
      existingVote.voteType = voteType;
      await existingVote.save();

      return res.status(200).json({
        success: true,
        message: 'Vote updated successfully',
        vote: existingVote,
        votes: contribution.votes,
      });
    }

    // Create a new vote
    const vote = new Vote({
      contributionId,
      storyId: contribution.storyId,
      userId: req.user.id,
      voteType,
    });

    // Save vote to database
    await vote.save();

    // Update contribution vote count
    if (voteType === 'upvote') {
      contribution.votes.upvotes += 1;
    } else {
      contribution.votes.downvotes += 1;
    }
    await contribution.save();

    // Add vote to user's votes array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { votes: vote._id },
    });

    res.status(201).json({
      success: true,
      message: 'Vote added successfully',
      vote,
      votes: contribution.votes,
    });
  } catch (error) {
    console.error('Create vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding vote',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all votes for a contribution
exports.getContributionVotes = async (req, res) => {
  try {
    const { contributionId } = req.params;

    // Check if contribution exists
    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }

    // Get votes
    const votes = await Vote.find({ contributionId })
      .populate('userId', 'username avatar');

    res.status(200).json({
      success: true,
      votes,
      summary: {
        upvotes: contribution.votes.upvotes,
        downvotes: contribution.votes.downvotes,
        total: contribution.votes.upvotes - contribution.votes.downvotes,
      },
    });
  } catch (error) {
    console.error('Get contribution votes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching votes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get user's vote for a contribution
exports.getUserVote = async (req, res) => {
  try {
    const { contributionId } = req.params;

    // Check if contribution exists
    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }

    // Get user's vote
    const vote = await Vote.findOne({
      contributionId,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      vote: vote || null,
    });
  } catch (error) {
    console.error('Get user vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching vote',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};