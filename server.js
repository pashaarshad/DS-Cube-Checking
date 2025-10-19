/* DS³ Backend Server
   Node.js + Express + MySQL
   Main server file
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Import routes
const skillsRoutes = require('./routes/skills');
const internshipsRoutes = require('./routes/internships');
const hackathonsRoutes = require('./routes/hackathons');
const chatsRoutes = require('./routes/chats');
const usersRoutes = require('./routes/users');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/skills', skillsRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/hackathons', hackathonsRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/users', usersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DS³ Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   DS³ Backend Server Started! 🚀     ║
  ╠═══════════════════════════════════════╣
  ║   Port: ${PORT}                          ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}            ║
  ║   Time: ${new Date().toLocaleString()}    ║
  ╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
