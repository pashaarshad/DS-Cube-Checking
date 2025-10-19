/* Internships API Routes
   CRUD operations for internships
*/

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all internships
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT i.*, u.username, u.display_name FROM internships i JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single internship
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT i.*, u.username, u.display_name FROM internships i JOIN users u ON i.user_id = u.id WHERE i.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new internship
router.post('/', async (req, res) => {
  try {
    const { user_id = 1, role, company, duration, note } = req.body;
    
    if (!role || !company) {
      return res.status(400).json({ 
        success: false, 
        error: 'Role and company are required' 
      });
    }

    const [result] = await db.query(
      'INSERT INTO internships (user_id, role, company, duration, note) VALUES (?, ?, ?, ?, ?)',
      [user_id, role, company, duration, note]
    );

    const [newInternship] = await db.query('SELECT * FROM internships WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Internship posted successfully',
      data: newInternship[0]
    });
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update internship
router.put('/:id', async (req, res) => {
  try {
    const { role, company, duration, note } = req.body;
    const { id } = req.params;

    const [result] = await db.query(
      'UPDATE internships SET role = ?, company = ?, duration = ?, note = ? WHERE id = ?',
      [role, company, duration, note, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    const [updated] = await db.query('SELECT * FROM internships WHERE id = ?', [id]);
    res.json({ 
      success: true, 
      message: 'Internship updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete internship
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM internships WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }

    res.json({ 
      success: true, 
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
