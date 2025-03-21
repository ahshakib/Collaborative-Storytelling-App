const Contribution = require('../models/contributionModel');
const Story = require('../models/storyModel');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// Create a new contribution
exports.createContribution = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { storyId, content, parentId } = req.body;

    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check if story is active
    if (story.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot contribute to a completed or archived story',
      });
    }

    // Check if max contributors limit is reached
    if (story.maxContributors > 0 && 
        story.contributors.length >= story.maxContributors && 
        !story.contributors.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Maximum number of contributors reached for this story',
      });
    }

    // Get the position for this contribution
    const lastContribution = await Contribution.findOne({ storyId })
      .sort({ position: -1 })
      .limit(1);

    const position = lastContribution ? lastContribution.position + 1 : 1;

    // Create new contribution
    const contribution = new Contribution({
      storyId,
      userId: req.user.id,
      content,
      parentId: parentId || null,
      position,
    });

    // Save contribution to database
    await contribution.save();

    // Add user to story contributors if not already there
    if (!story.contributors.includes(req.user.id)) {
      story.contributors.push(req.user.id);
      await story.save();
    }

    // Add contribution to user's contributions array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { contributions: contribution._id },
    });

    // Populate user info for response
    const populatedContribution = await Contribution.findById(contribution._id)
      .populate('userId', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Contribution added successfully',
      contribution: populatedContribution,
    });
  } catch (error) {
    console.error('Create contribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all contributions for a story
exports.getStoryContributions = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { sort = 'position', order = 'asc' } = req.query;

    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check if story is private and user is not creator or admin
    if (story.isPrivate && (!req.user || (req.user.id !== story.creator.toString() && req.user.role !== 'admin'))) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this story\'s contributions',
      });
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Get contributions
    const contributions = await Contribution.find({ storyId })
      .sort(sortObj)
      .populate('userId', 'username avatar')
      .populate('parentId');

    res.status(200).json({
      success: true,
      contributions,
    });
  } catch (error) {
    console.error('Get story contributions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contributions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get a single contribution by ID
exports.getContributionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find contribution by ID
    const contribution = await Contribution.findById(id)
      .populate('userId', 'username avatar bio')
      .populate('storyId', 'title creator isPrivate')
      .populate('parentId');

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }

    // Check if story is private and user is not creator or admin
    const story = contribution.storyId;
    if (story.isPrivate && (!req.user || (req.user.id !== story.creator.toString() && req.user.role !== 'admin'))) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this contribution',
      });
    }

    res.status(200).json({
      success: true,
      contribution,
    });
  } catch (error) {
    console.error('Get contribution by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update a contribution
exports.updateContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, status } = req.body;

    // Find contribution by ID
    const contribution = await Contribution.findById(id);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }

    // Check if user is the author or admin
    if (req.user.id !== contribution.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this contribution',
      });
    }

    // Update contribution fields
    if (content) contribution.content = content;
    if (status && req.user.role === 'admin') contribution.status = status;

    // Save updated contribution
    await contribution.save();

    // Populate user info for response
    const populatedContribution = await Contribution.findById(contribution._id)
      .populate('userId', 'username avatar');

    res.status(200).json({
      success: true,
      message: 'Contribution updated successfully',
      contribution: populatedContribution,
    });
  } catch (error) {
    console.error('Update contribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete a contribution
exports.deleteContribution = async (req, res) => {
  try {
    const { id } = req.params;

    // Find contribution by ID
    const contribution = await Contribution.findById(id);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }

    // Check if user is the author or admin
    if (req.user.id !== contribution.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this contribution',
      });
    }

    // Delete the contribution
    await Contribution.findByIdAndDelete(id);

    // Remove contribution from user's contributions array
    await User.updateOne(
      { _id: contribution.userId },
      { $pull: { contributions: id } }
    );

    res.status(200).json({
      success: true,
      message: 'Contribution deleted successfully',
    });
  } catch (error) {
    console.error('Delete contribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Add a comment to a contribution
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Validate comment text
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 500 characters',
      });
    }

    // Find contribution by ID
    const contribution = await Contribution.findById(id);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }

    // Add comment
    contribution.comments.push({
      userId: req.user.id,
      text,
    });

    // Save updated contribution
    await contribution.save();

    // Get the newly added comment
    const newComment = contribution.comments[contribution.comments.length - 1];

    // Populate user info for the comment
    const populatedComment = await User.populate(newComment, {
      path: 'userId',
      select: 'username avatar',
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Select a contribution for the main storyline
exports.selectContribution = async (req, res) => {
  try {
    const { id } = req.params;

    // Find contribution by ID
    const contribution = await Contribution.findById(id);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }

    // Find the story
    const story = await Story.findById(contribution.storyId);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check if user is the story creator or admin
    if (req.user.id !== story.creator.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the story creator can select contributions for the main storyline',
      });
    }

    // Unselect any other contributions at the same position
    await Contribution.updateMany(
      { 
        storyId: contribution.storyId, 
        position: contribution.position,
        _id: { $ne: id }
      },
      { isSelected: false }
    );

    // Select this contribution
    contribution.isSelected = true;
    contribution.status = 'approved';
    await contribution.save();

    res.status(200).json({
      success: true,
      message: 'Contribution selected for the main storyline',
      contribution,
    });
  } catch (error) {
    console.error('Select contribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while selecting contribution',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};