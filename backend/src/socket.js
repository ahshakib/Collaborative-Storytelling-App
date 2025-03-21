/**
 * Socket.io handlers for real-time collaboration
 */

const setupSocketHandlers = (io) => {
  // Track active users in each story room
  const activeUsers = {};

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a story room
    socket.on('join-story', ({ storyId, user }) => {
      socket.join(`story:${storyId}`);
      
      // Add user to active users for this story
      if (!activeUsers[storyId]) {
        activeUsers[storyId] = [];
      }
      
      const userInfo = {
        id: user._id,
        name: user.username,
        socketId: socket.id
      };
      
      // Check if user is already in the room (reconnection)
      const existingUserIndex = activeUsers[storyId].findIndex(u => u.id === user._id);
      if (existingUserIndex === -1) {
        activeUsers[storyId].push(userInfo);
      } else {
        // Update socket ID if reconnecting
        activeUsers[storyId][existingUserIndex].socketId = socket.id;
      }
      
      // Broadcast updated active users list
      io.to(`story:${storyId}`).emit('active-users', activeUsers[storyId]);
      
      console.log(`User ${user.username} joined story ${storyId}`);
    });

    // Leave a story room
    socket.on('leave-story', ({ storyId, userId }) => {
      socket.leave(`story:${storyId}`);
      
      // Remove user from active users
      if (activeUsers[storyId]) {
        activeUsers[storyId] = activeUsers[storyId].filter(u => u.id !== userId);
        
        // Broadcast updated active users list
        io.to(`story:${storyId}`).emit('active-users', activeUsers[storyId]);
      }
      
      console.log(`User ${userId} left story ${storyId}`);
    });

    // New contribution submitted
    socket.on('new-contribution', (contribution) => {
      // Broadcast to all users in the story room
      socket.to(`story:${contribution.storyId}`).emit('contribution-added', contribution);
    });

    // User is typing
    socket.on('typing', ({ storyId, user }) => {
      socket.to(`story:${storyId}`).emit('user-typing', {
        userId: user._id,
        username: user.username
      });
    });

    // User stopped typing
    socket.on('stop-typing', ({ storyId, userId }) => {
      socket.to(`story:${storyId}`).emit('user-stop-typing', { userId });
    });

    // New vote submitted
    socket.on('new-vote', (vote) => {
      socket.to(`story:${vote.storyId}`).emit('vote-added', vote);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove user from all active story rooms
      Object.keys(activeUsers).forEach(storyId => {
        const userIndex = activeUsers[storyId].findIndex(u => u.socketId === socket.id);
        
        if (userIndex !== -1) {
          activeUsers[storyId].splice(userIndex, 1);
          io.to(`story:${storyId}`).emit('active-users', activeUsers[storyId]);
        }
      });
    });
  });
};

module.exports = { setupSocketHandlers };