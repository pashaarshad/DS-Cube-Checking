/* Users API Routes
   User management
*/

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, display_name, avatar_url, created_at FROM users ORDER BY username');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, display_name, avatar_url, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by username
router.get('/username/:username', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, display_name, avatar_url, created_at FROM users WHERE username = ?',
      [req.params.username]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { username, email, display_name, avatar_url } = req.body;
    
    if (!username) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    const [result] = await db.query(
      'INSERT INTO users (username, email, display_name, avatar_url) VALUES (?, ?, ?, ?)',
      [username, email, display_name, avatar_url]
    );

    const [newUser] = await db.query('SELECT id, username, email, display_name, avatar_url, created_at FROM users WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Username or email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { email, display_name, avatar_url } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE users SET email = ?, display_name = ?, avatar_url = ? WHERE id = ?',
      [email, display_name, avatar_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const [updated] = await db.query('SELECT id, username, email, display_name, avatar_url, created_at FROM users WHERE id = ?', [id]);
    res.json({ 
      success: true, 
      message: 'User updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
