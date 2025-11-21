const Story = require('../models/storyModel');
const User = require('../models/userModel');
const Contribution = require('../models/contributionModel');
const { validationResult } = require('express-validator');

// Create a new story
exports.createStory = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, genre, tags, isPrivate, maxContributors, contributionTimeLimit, coverImage } = req.body;

    // Create new story
    const story = new Story({
      title,
      description,
      genre,
      tags: tags || [],
      creator: req.user.id,
      contributors: [req.user.id], // Add creator as first contributor
      isPrivate: isPrivate || false,
      maxContributors: maxContributors || 0,
      contributionTimeLimit: contributionTimeLimit || 0,
      coverImage: coverImage || '',
    });

    // Save story to database
    await story.save();

    // Add story to user's stories array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { stories: story._id },
    });

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      story,
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating story',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all stories (with pagination and filters)
exports.getAllStories = async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, status, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    const query = {};
    
    // Add filters if provided
    if (genre) query.genre = genre;
    if (status) query.status = status;
    
    // Only show public stories unless user is admin
    if (req.user?.role !== 'admin') {
      query.isPrivate = { $ne: true };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const stories = await Story.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('creator', 'username avatar')
      .populate('contributors', 'username avatar');
    
    // Get total count for pagination
    const total = await Story.countDocuments(query);
    
    res.status(200).json({
      success: true,
      stories,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get a single story by ID
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find story by ID
    const story = await Story.findById(id)
      .populate('creator', 'username avatar bio')
      .populate('contributors', 'username avatar')
      .populate({
        path: 'contributions',
        populate: {
          path: 'userId',
          select: 'username avatar',
        },
        options: { sort: { position: 1, createdAt: 1 } },
      });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }
    
    // Check if story is private and user is not creator or admin
    if (story.isPrivate && (!req.user || (req.user.id !== story.creator._id.toString() && req.user.role !== 'admin'))) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this story',
      });
    }
    
    // Increment view count
    story.views += 1;
    await story.save();
    
    res.status(200).json({
      success: true,
      story,
    });
  } catch (error) {
    console.error('Get story by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching story',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update a story
exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, genre, tags, isPrivate, maxContributors, contributionTimeLimit, status, coverImage } = req.body;
    
    // Find story by ID
    const story = await Story.findById(id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }
    
    // Check if user is creator or admin
    if (req.user.id !== story.creator.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this story',
      });
    }
    
    // Update story fields
    if (title) story.title = title;
    if (description) story.description = description;
    if (genre) story.genre = genre;
    if (tags) story.tags = tags;
    if (isPrivate !== undefined) story.isPrivate = isPrivate;
    if (maxContributors !== undefined) story.maxContributors = maxContributors;
    if (contributionTimeLimit !== undefined) story.contributionTimeLimit = contributionTimeLimit;
    if (status) story.status = status;
    if (coverImage) story.coverImage = coverImage;
    
    // Save updated story
    await story.save();
    
    res.status(200).json({
      success: true,
      message: 'Story updated successfully',
      story,
    });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating story',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete a story
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find story by ID
    const story = await Story.findById(id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }
    
    // Check if user is creator or admin
    if (req.user.id !== story.creator.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this story',
      });
    }
    
    // Delete all contributions related to this story
    await Contribution.deleteMany({ storyId: id });
    
    // Remove story from users' stories arrays
    await User.updateMany(
      { stories: id },
      { $pull: { stories: id } }
    );
    
    // Delete the story
    await Story.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting story',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Like a story
exports.likeStory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find story by ID
    const story = await Story.findById(id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }
    
    // Increment like count
    story.likes += 1;
    await story.save();
    
    res.status(200).json({
      success: true,
      message: 'Story liked successfully',
      likes: story.likes,
    });
  } catch (error) {
    console.error('Like story error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while liking story',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get platform stats
exports.getStats = async (req, res) => {
  try {
    const storyCount = await Story.countDocuments({ isPrivate: { $ne: true } });
    const userCount = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      stats: {
        stories: storyCount,
        writers: userCount,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};