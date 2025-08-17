import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message.js';

export const initSocket = (httpServer, corsOrigin) => {
  const io = new Server(httpServer, { cors: { origin: corsOrigin, credentials: true } });

  // Auth handshake
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No auth token'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload; // { id, username }
      next();
    } catch (e) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const username = socket.user.username;
    const room = socket.handshake.query?.room || 'global';
    socket.join(room);

    // Broadcast join
    socket.to(room).emit('presence', { type: 'join', username });

    socket.on('message', async (payload, cb) => {
      try {
        const content = String(payload?.content || '').trim();
        const targetRoom = String(payload?.room || room);
        if (!content) return cb && cb({ ok: false, error: 'Empty message' });

        const msg = await Message.create({ sender: socket.user.id, room: targetRoom, content });
        const out = { _id: msg._id, content: msg.content, room: targetRoom, createdAt: msg.createdAt, sender: { _id: socket.user.id, username } };
        io.to(targetRoom).emit('message', out);
        cb && cb({ ok: true });
      } catch (e) {
        console.error(e);
        cb && cb({ ok: false, error: 'Failed to send' });
      }
    });

    socket.on('disconnect', () => {
      socket.to(room).emit('presence', { type: 'leave', username });
    });
  });

  return io;
};