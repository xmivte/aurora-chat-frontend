import React from "react";
import '../App.css';

interface ChatListProps {
  chats: { id: number; name: string; image: string, unread?: boolean }[];
  onSelectChat: (id: number) => void;
  selectedChatId: number | null;
}

const ChatList = ({ chats, onSelectChat, selectedChatId }: ChatListProps) => {
  return (
    <div className = 'chat-list'>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chat-item ${chat.id === selectedChatId ? "selected" : ""}`}
          >
            {/*<div className="chat-avatar"></div>*/}
            {chat.image?
            (<div className="chat-avatar"><img src = {chat.image} /></div>):(<div className="chat-avatar"></div>)  
            }

             <span className={`chat-name ${chat.unread ? "unread" : ""}`}>{chat.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;