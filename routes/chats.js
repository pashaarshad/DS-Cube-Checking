/* Chats API Routes
   Chat rooms and messages management
*/

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all chat rooms for a user
router.get('/rooms', async (req, res) => {
  try {
    const userId = req.query.user_id || 1;
    const [rows] = await db.query(`
      SELECT cr.*, 
        (SELECT COUNT(*) FROM messages WHERE room_id = cr.id) as message_count,
        (SELECT created_at FROM messages WHERE room_id = cr.id ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM chat_rooms cr
      JOIN chat_participants cp ON cr.id = cp.room_id
      WHERE cp.user_id = ?
      ORDER BY last_message_time DESC
    `, [userId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get messages from a specific room
router.get('/rooms/:roomId/messages', async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = req.query.limit || 100;
    
    const [rows] = await db.query(`
      SELECT m.*, u.username, u.display_name 
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.room_id = ?
      ORDER BY m.created_at DESC
      LIMIT ?
    `, [roomId, parseInt(limit)]);
    
    res.json({ success: true, data: rows.reverse() });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send a message to a room
router.post('/rooms/:roomId/messages', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { sender_id = 1, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const [result] = await db.query(
      'INSERT INTO messages (room_id, sender_id, message) VALUES (?, ?, ?)',
      [roomId, sender_id, message]
    );

    const [newMessage] = await db.query(`
      SELECT m.*, u.username, u.display_name 
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `, [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      data: newMessage[0]
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new chat room (1-to-1 or group)
router.post('/rooms', async (req, res) => {
  try {
    const { name, type = 'one_to_one', participants = [] } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO chat_rooms (name, type) VALUES (?, ?)',
      [name, type]
    );

    const roomId = result.insertId;

    // Add participants
    if (participants.length > 0) {
      const values = participants.map(userId => [roomId, userId]);
      await db.query(
        'INSERT INTO chat_participants (room_id, user_id) VALUES ?',
        [values]
      );
    }

    const [newRoom] = await db.query('SELECT * FROM chat_rooms WHERE id = ?', [roomId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Chat room created successfully',
      data: newRoom[0]
    });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get or create 1-to-1 chat room between two users
router.post('/rooms/one-to-one', async (req, res) => {
  try {
    const { user1_id, user2_id } = req.body;
    
    if (!user1_id || !user2_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Both user IDs are required' 
      });
    }

    // Check if room already exists
    const [existing] = await db.query(`
      SELECT cr.* FROM chat_rooms cr
      WHERE cr.type = 'one_to_one'
      AND cr.id IN (
        SELECT cp1.room_id FROM chat_participants cp1
        WHERE cp1.user_id = ?
        AND EXISTS (
          SELECT 1 FROM chat_participants cp2 
          WHERE cp2.room_id = cp1.room_id AND cp2.user_id = ?
        )
      )
    `, [user1_id, user2_id]);

    if (existing.length > 0) {
      return res.json({ 
        success: true, 
        message: 'Chat room already exists',
        data: existing[0]
      });
    }

    // Create new room
    const [user2] = await db.query('SELECT username FROM users WHERE id = ?', [user2_id]);
    const roomName = `Chat with ${user2[0]?.username || 'User'}`;

    const [result] = await db.query(
      'INSERT INTO chat_rooms (name, type) VALUES (?, ?)',
      [roomName, 'one_to_one']
    );

    const roomId = result.insertId;
    await db.query(
      'INSERT INTO chat_participants (room_id, user_id) VALUES (?, ?), (?, ?)',
      [roomId, user1_id, roomId, user2_id]
    );

    const [newRoom] = await db.query('SELECT * FROM chat_rooms WHERE id = ?', [roomId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Chat room created successfully',
      data: newRoom[0]
    });
  } catch (error) {
    console.error('Error creating 1-to-1 chat:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a message
router.delete('/messages/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.json({ 
      success: true, 
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
