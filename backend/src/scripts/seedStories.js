/**
 * Seed script to populate the database with sample stories
 * 
 * Usage: 
 * 1. Make sure MongoDB is running
 * 2. Run this script with: node src/scripts/seedStories.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Story = require('../models/storyModel');
const User = require('../models/userModel');

// Read sample stories from JSON file
const sampleStoriesPath = path.join(__dirname, '../../../sample-stories.json');
const sampleStories = JSON.parse(fs.readFileSync(sampleStoriesPath, 'utf8'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed function
async function seedStories() {
  try {
    // Find an admin user to set as creator
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    
    // Delete existing stories (optional - comment out if you don't want to delete existing stories)
    await Story.deleteMany({});
    console.log('Existing stories deleted');
    
    // Prepare stories with admin user as creator
    const storiesWithCreator = sampleStories.map(story => ({
      ...story,
      creator: adminUser._id,
      contributors: [adminUser._id],
      status: 'active'
    }));
    
    // Insert stories
    const insertedStories = await Story.insertMany(storiesWithCreator);
    console.log(`${insertedStories.length} sample stories inserted successfully`);
    
    // Update user's stories array
    await User.findByIdAndUpdate(adminUser._id, {
      $push: { stories: { $each: insertedStories.map(story => story._id) } }
    });
    console.log(`Updated user ${adminUser.username} with new stories`);
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding stories:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the seed function
seedStories();