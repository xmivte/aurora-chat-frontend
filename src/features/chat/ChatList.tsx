import './ChatList.css';
import { Chat } from './index';

import avatar from './assets/avatar.png';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (id: number) => void;
  selectedChatId: number | null;
}

const ChatList = ({ chats, onSelectChat, selectedChatId }: ChatListProps) => {
  return (
    <div className="chat-list">
      <ul>
        {chats.map(chat => (
          <li key={chat.id} className={`chat-item ${chat.id === selectedChatId ? 'selected' : ''}`}>
            <button className="chat-button" onClick={() => onSelectChat(chat.id)}>
              <div className="chat-avatar">
                <img src={chat.image || avatar} alt={chat.name || 'avatar'} />
              </div>
              <span className={`chat-name ${chat.unread ? 'unread' : ''}`}>{chat.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
