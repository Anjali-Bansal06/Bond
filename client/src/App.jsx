import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Chat from './pages/Chat.jsx';

export default function App({ page }) {
  if (page === 'login') return <Login />;
  if (page === 'register') return <Register />;
  return <Chat />;
}
