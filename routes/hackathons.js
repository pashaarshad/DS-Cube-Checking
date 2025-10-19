/* Hackathons API Routes
   CRUD operations for hackathons
*/

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all hackathons
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT h.*, u.username, u.display_name FROM hackathons h JOIN users u ON h.user_id = u.id ORDER BY h.created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single hackathon
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT h.*, u.username, u.display_name FROM hackathons h JOIN users u ON h.user_id = u.id WHERE h.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Hackathon not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new hackathon
router.post('/', async (req, res) => {
  try {
    const { user_id = 1, name, organizer, dates, link, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Hackathon name is required' 
      });
    }

    const [result] = await db.query(
      'INSERT INTO hackathons (user_id, name, organizer, dates, link, description) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, name, organizer, dates, link, description]
    );

    const [newHackathon] = await db.query('SELECT * FROM hackathons WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Hackathon posted successfully',
      data: newHackathon[0]
    });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update hackathon
router.put('/:id', async (req, res) => {
  try {
    const { name, organizer, dates, link, description } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE hackathons SET name = ?, organizer = ?, dates = ?, link = ?, description = ? WHERE id = ?',
      [name, organizer, dates, link, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Hackathon not found' });
    }

    const [updated] = await db.query('SELECT * FROM hackathons WHERE id = ?', [id]);
    res.json({ 
      success: true, 
      message: 'Hackathon updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating hackathon:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete hackathon
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM hackathons WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Hackathon not found' });
    }

    res.json({ 
      success: true, 
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hackathon:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
