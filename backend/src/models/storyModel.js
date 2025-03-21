const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: [
        'Fantasy',
        'Science Fiction',
        'Mystery',
        'Horror',
        'Romance',
        'Adventure',
        'Thriller',
        'Historical Fiction',
        'Comedy',
        'Drama',
        'Other',
      ],
    },
    tags: [{
      type: String,
      trim: true,
    }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contributors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    maxContributors: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    contributionTimeLimit: {
      type: Number,
      default: 0, // 0 means no time limit (in hours)
    },
    coverImage: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual field for contributions
storySchema.virtual('contributions', {
  ref: 'Contribution',
  localField: '_id',
  foreignField: 'storyId',
});

// Always populate the virtual fields
storySchema.set('toObject', { virtuals: true });
storySchema.set('toJSON', { virtuals: true });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;