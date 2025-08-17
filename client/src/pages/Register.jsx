import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser(username, password);
      login(data);
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth">
      <h1>Create account</h1>
      <form onSubmit={onSubmit}>
        <div><input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button type="submit">Register</button>
          <Link className="link" to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
