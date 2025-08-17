import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiLogin(username, password);
      login(data);
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth">
      <h1>Welcome back</h1>
      <form onSubmit={onSubmit}>
        <div><input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button type="submit">Login</button>
          <Link className="link" to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
