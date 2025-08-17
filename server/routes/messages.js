import { Router } from 'express';
import Message from '../models/Message.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Get last 50 messages from a room
router.get('/:room', authMiddleware, async (req, res) => {
  const { room } = req.params;
  const msgs = await Message.find({ room }).sort({ createdAt: -1 }).limit(50).populate('sender', 'username');
  res.json(msgs.reverse());
});

export default router;