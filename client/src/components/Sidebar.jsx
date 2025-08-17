import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar({ room, setRoom }) {
  const { user, logout } = useAuth();
  const rooms = ['global', 'sports', 'tech', 'random'];
  return (
    <div className="sidebar">
      <div style={{marginBottom:16}}><strong>Logged in as:</strong><br />{user?.username}</div>
      <div style={{marginBottom:12, fontWeight:600}}>Rooms</div>
      <div style={{display:'grid', gap:6}}>
        {rooms.map(r => (
          <div key={r} className={`room ${r===room?'active':''}`} onClick={()=>setRoom(r)}>{r}</div>
        ))}
      </div>
      <div style={{marginTop:24}}>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
