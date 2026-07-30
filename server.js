// This is a conceptual example for your server-side code.
// You will need to integrate this into your actual server.js or API routes file.

const express = require('express');
const app = express();
// Assuming you have a User model and a database connection
// const User = require('./models/User'); // Your User model
// const { Op } = require('sequelize'); // If using Sequelize for example

// Middleware to check if the user is an admin (implement this based on your auth system)
function isAdmin(req, res, next) {
  // Placeholder: Replace with your actual admin check logic
  if (req.session && req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
}

/**
 * GET /api/admin/stats/active-users
 * Calculates and returns the number of users who have been active
 * (logged in) in the last 30 days.
 */
app.get('/api/admin/stats/active-users', isAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Replace this with your actual database query to count active users
    // Example using a hypothetical User model with a 'last_login' field:
    // const activeUserCount = await User.count({
    //   where: {
    //     last_login: {
    //       [Op.gte]: thirtyDaysAgo, // Greater than or equal to 30 days ago
    //     },
    //   },
    // });
    // For demonstration, we'll return a static number as mock data.
    const activeUserCount = Math.floor(Math.random() * 100) + 50; // Mock data

    res.status(200).json({ monthlyActiveUsers: activeUserCount });
  } catch (error) {
    console.error('Error fetching active user stats:', error);
    res.status(500).json({ message: 'Failed to fetch active user statistics.' });
  }
});

// Other server routes and setup...

// Example: Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });