import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import { initSocket } from './socket.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.get('/', (req, res) => res.send('Chat server running'));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);

async function start() {
  await connectDB();
  const io = initSocket(server, process.env.CLIENT_URL);
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(` Server listening on http://localhost:${port}`));
}

start();