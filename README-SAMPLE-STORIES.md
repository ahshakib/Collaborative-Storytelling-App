# Sample Stories for Testing

This repository contains sample stories and contributions for testing the Collaborative Storytelling Platform. These samples cover various genres and demonstrate different features of the platform.

## Available Sample Data

### Sample Stories

The `sample-stories.json` file contains 10 sample stories across different genres:

1. **The Lost City of Atlantis** (Adventure)
2. **Echoes of Tomorrow** (Science Fiction)
3. **Whispers in the Attic** (Horror)
4. **The Detective's Last Case** (Mystery)
5. **Roses in Winter** (Romance)
6. **The Dragon's Apprentice** (Fantasy)
7. **The Last Laugh** (Comedy)
8. **1863: Divided Hearts** (Historical Fiction)
9. **The Countdown** (Thriller)
10. **Backstage Shadows** (Drama)

Each story includes:

- Title
- Description
- Genre
- Tags
- Privacy settings
- Contributor limits
- Time limits for contributions

### Sample Contributions

The `seedContributions.js` script contains sample contributions for each story genre. Each story has three sample contributions that demonstrate how a collaborative story might develop.

## How to Use the Sample Data

### Prerequisites

1. Make sure MongoDB is running
2. Ensure you have at least one admin user in your database

### Seeding the Database

1. First, seed the stories:

   ```
   cd backend
   node src/scripts/seedStories.js
   ```

2. Then, seed the contributions:
   ```
   node src/scripts/seedContributions.js
   ```

## Testing Features

With these sample stories and contributions, you can test various features of the platform:

1. **Story Browsing**: View the variety of stories across different genres
2. **Story Details**: Examine how story details are displayed
3. **Contribution Flow**: See how contributions build upon each other
4. **Voting System**: Test the voting functionality on contributions
5. **Privacy Settings**: Test how private vs. public stories behave
6. **Contributor Limits**: Test the maximum contributor functionality
7. **Time Limits**: Test the contribution time limit functionality

## Customizing Samples

You can modify the sample data to test specific scenarios:

1. Edit `sample-stories.json` to add or modify stories
2. Edit the `sampleContributions` object in `seedContributions.js` to change contribution content

## Notes

- Running the seed scripts will delete existing stories and contributions
- All sample stories will be created under the admin user account
- Sample contributions will be distributed among available users
