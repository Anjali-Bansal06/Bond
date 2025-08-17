import { useState } from 'react';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  const send = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };
  return (
    <div className="inputBar">
      <input
        placeholder="Write a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
