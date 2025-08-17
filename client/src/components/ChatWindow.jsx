export default function ChatWindow({ messages, me }) {
  return (
    <div className="messages">
      {messages.map(m => {
        const isMe = m.sender?._id === me?.id || m.sender?.username === me?.username;
        return (
          <div key={m._id + m.createdAt} className={`msg ${isMe? 'me' : 'other'}`}>
            {!isMe && <div style={{fontSize:12,opacity:.7,marginBottom:4}}>{m.sender?.username}</div>}
            <div>{m.content}</div>
            <div style={{fontSize:11,opacity:.6,marginTop:4}}>{new Date(m.createdAt).toLocaleTimeString()}</div>
          </div>
        );
      })}
    </div>
  );
}
