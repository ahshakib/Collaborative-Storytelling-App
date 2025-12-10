const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [10, 'Contribution must be at least 10 characters long'],
      maxlength: [5000, 'Contribution cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'draft'],
      default: 'pending',
    },
    position: {
      type: Number,
      default: 0, // Position in the story sequence
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contribution',
      default: null, // For branching narratives
    },
    isSelected: {
      type: Boolean,
      default: false, // Whether this contribution is part of the main storyline
    },
    votes: {
      upvotes: {
        type: Number,
        default: 0,
      },
      downvotes: {
        type: Number,
        default: 0,
      },
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: [500, 'Comment cannot exceed 500 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Virtual field for votes
contributionSchema.virtual('voteCount', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'contributionId',
  count: true,
});

// Always populate the virtual fields
contributionSchema.set('toObject', { virtuals: true });
contributionSchema.set('toJSON', { virtuals: true });

const Contribution = mongoose.model('Contribution', contributionSchema);

module.exports = Contribution;