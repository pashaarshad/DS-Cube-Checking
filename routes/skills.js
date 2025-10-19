/* Skills API Routes
   CRUD operations for skills
*/

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all skills (with optional user filter)
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Default to user 1
    const [rows] = await db.query(
      'SELECT s.*, u.username, u.display_name FROM skills s JOIN users u ON s.user_id = u.id WHERE s.user_id = ? ORDER BY s.created_at DESC',
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single skill by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT s.*, u.username, u.display_name FROM skills s JOIN users u ON s.user_id = u.id WHERE s.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new skill
router.post('/', async (req, res) => {
  try {
    const { user_id = 1, name, note, progress = 0 } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Skill name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO skills (user_id, name, note, progress) VALUES (?, ?, ?, ?)',
      [user_id, name, note, progress]
    );

    const [newSkill] = await db.query('SELECT * FROM skills WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Skill added successfully',
      data: newSkill[0]
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update skill
router.put('/:id', async (req, res) => {
  try {
    const { name, note, progress } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE skills SET name = ?, note = ?, progress = ? WHERE id = ?',
      [name, note, progress, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    const [updated] = await db.query('SELECT * FROM skills WHERE id = ?', [id]);
    res.json({ 
      success: true, 
      message: 'Skill updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete skill
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    res.json({ 
      success: true, 
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
