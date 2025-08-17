import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchMessages } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import MessageInput from '../components/MessageInput.jsx';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function Chat() {
  const { user } = useAuth();
  const [room, setRoom] = useState('global');
  const [messages, setMessages] = useState([]);
  const [presenceNote, setPresenceNote] = useState('');
  const socketRef = useRef(null);

  const me = useMemo(
    () => (user ? { id: user._id || user.id, username: user.username } : null),
    [user]
  );

  // fetch history when room changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const msgs = await fetchMessages(room);
        if (mounted) setMessages(Array.isArray(msgs) ? msgs : []);
      } catch (err) {
        console.error('Failed to fetch messages for room', room, err);
        if (mounted) setMessages([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [room]);

  // Connect socket every time `room` changes
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token in localStorage — socket will not connect');
      return;
    }

    // connect with query: { room }
    const socket = io(SOCKET_URL, {
      auth: { token },
      query: { room }, // let server handle joining
      transports: ['websocket'],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('presence', (note) => {
      setPresenceNote(
        `${note.username} ${note.type === 'join' ? 'joined' : 'left'} ${room}`
      );
      setTimeout(() => setPresenceNote(''), 4000);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect_error', err);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    return () => {
      socket.disconnect(); // clean up connection
      socketRef.current = null;
    };
  }, [user, room]); // reconnect when room changes

  const onSend = (text) => {
    const socket = socketRef.current;
    if (socket && socket.connected) {
        socket.emit('message', { room, content: text });
    } else {
      console.warn('Socket not connected: message not sent');
    }
  };

  return (
    <div className="container">
      <Sidebar room={room} setRoom={setRoom} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="header">
          <div>
            <strong>Room:</strong> {room}
          </div>
          <div className="presence">{presenceNote}</div>
        </div>
        <ChatWindow messages={messages} me={me} />
        <MessageInput onSend={onSend} />
      </div>
    </div>
  );
}
