import React from "react";
import './style.css';
import avatar from '../../img/avatar.png';

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
            tabIndex={0}
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chat-item ${chat.id === selectedChatId ? "selected" : ""}`}
          >
            {chat.image?
            (<div className="chat-avatar"><img src = {chat.image} alt = {chat.name}/></div>):(<div className="chat-avatar"><img src={avatar} alt = "avatar"/></div>)  
            }

             <span className={`chat-name ${chat.unread ? "unread" : ""}`}>{chat.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;