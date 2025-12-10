const Story = require('../models/storyModel');
const User = require('../models/userModel');
const Invite = require('../models/inviteModel');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// Invite a user to collaborate
exports.inviteCollaborator = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { storyId, email, role } = req.body;

    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check permissions (only creator or editor can invite)
    const isCreator = story.creator.toString() === req.user.id;
    const isEditor = story.collaborators.some(
      (c) => c.user.toString() === req.user.id && c.role === 'editor'
    );

    if (!isCreator && !isEditor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to invite collaborators',
      });
    }

    // Check if user is already a collaborator
    const userToInvite = await User.findOne({ email });
    if (userToInvite) {
      const isAlreadyCollaborator = story.collaborators.some(
        (c) => c.user.toString() === userToInvite._id.toString()
      );
      if (isAlreadyCollaborator) {
        return res.status(400).json({
          success: false,
          message: 'User is already a collaborator',
        });
      }
      if (story.creator.toString() === userToInvite._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'User is the creator of the story',
        });
      }
    }

    // Check if invite already exists
    const existingInvite = await Invite.findOne({ email, storyId });
    if (existingInvite) {
      return res.status(400).json({
        success: false,
        message: 'Invite already sent to this email',
      });
    }

    // Create invite token
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const invite = new Invite({
      email,
      storyId,
      invitedBy: req.user.id,
      role: role || 'contributor',
      token,
      expiresAt,
    });

    await invite.save();

    // In a real app, send email here
    // For now, return token
    
    res.status(201).json({
      success: true,
      message: 'Invite sent successfully',
      invite: {
        email: invite.email,
        role: invite.role,
        token: invite.token, // For development/testing
      }
    });
  } catch (error) {
    console.error('Invite collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending invite',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Accept an invite
exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.body;

    const invite = await Invite.findOne({
      token,
      expiresAt: { $gt: Date.now() },
    });

    if (!invite) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invite token',
      });
    }

    // Check if logged in user matches invite email
    if (req.user.email !== invite.email) {
      return res.status(403).json({
        success: false,
        message: 'This invite is for a different email address',
      });
    }

    const story = await Story.findById(invite.storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Add to collaborators
    // Check if already added to avoid duplicates
    const isAlreadyCollaborator = story.collaborators.some(
      (c) => c.user.toString() === req.user.id
    );

    if (!isAlreadyCollaborator) {
      story.collaborators.push({
        user: req.user.id,
        role: invite.role,
      });
      await story.save();
    }

    // Delete invite
    await Invite.findByIdAndDelete(invite._id);

    res.status(200).json({
      success: true,
      message: 'Invite accepted successfully',
      storyId: story._id,
    });
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting invite',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get collaborators for a story
exports.getCollaborators = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId)
      .populate('collaborators.user', 'username email avatar')
      .populate('creator', 'username email avatar');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check permissions (public story or user is creator/collaborator/admin)
    const isCreator = req.user && story.creator._id.toString() === req.user.id;
    const isCollaborator = req.user && story.collaborators.some(
      (c) => c.user._id.toString() === req.user.id
    );

    if (story.isPrivate && !isCreator && !isCollaborator && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view collaborators',
      });
    }

    res.status(200).json({
      success: true,
      creator: story.creator,
      collaborators: story.collaborators,
    });
  } catch (error) {
    console.error('Get collaborators error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching collaborators',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Remove a collaborator
exports.removeCollaborator = async (req, res) => {
  try {
    const { storyId, userId } = req.params;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check permissions (only creator can remove)
    if (story.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      // Allow users to remove themselves (leave story)
      if (req.user.id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to remove collaborators',
        });
      }
    }

    // Remove collaborator
    story.collaborators = story.collaborators.filter(
      (c) => c.user.toString() !== userId
    );

    await story.save();

    res.status(200).json({
      success: true,
      message: 'Collaborator removed successfully',
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing collaborator',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update collaborator role
exports.updateCollaboratorRole = async (req, res) => {
  try {
    const { storyId, userId } = req.params;
    const { role } = req.body;

    if (!['editor', 'contributor', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check permissions (only creator can update roles)
    if (story.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update collaborator roles',
      });
    }

    // Find and update collaborator
    const collaborator = story.collaborators.find(
      (c) => c.user.toString() === userId
    );

    if (!collaborator) {
      return res.status(404).json({
        success: false,
        message: 'Collaborator not found',
      });
    }

    collaborator.role = role;
    await story.save();

    res.status(200).json({
      success: true,
      message: 'Collaborator role updated successfully',
    });
  } catch (error) {
    console.error('Update collaborator role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating collaborator role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
