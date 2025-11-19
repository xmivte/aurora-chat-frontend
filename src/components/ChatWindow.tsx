import React from "react";
import '../App.css';

interface ChatWindowProps {
  chat: { id: number; name: string } | null;
}

const ChatWindow = ({ chat }: ChatWindowProps) => {
  return (
    <div style={{ width: "70%", padding: "20px", color: "white" }}>
      {chat ? (
        <div>
          Placeholder for ChatWindow - for testing purposes: selected {chat.name}
        </div>
      ) : (
        <p>Select a chat to view messages</p>
      )}
    </div>
  );
};

export default ChatWindow;