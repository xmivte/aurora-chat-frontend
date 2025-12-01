import firstUser from '@/assets/firstUser.svg';
import secondUser from '@/assets/secondUser.svg';
import thirdUser from '@/assets/thirdUser.svg';
import ChatSideBar from '@/right-sidebar/ChatSideBar';
import { type MembersInfo } from '@/right-sidebar/ChatSideBar';
import React from 'react';
import '../App.css';

interface ChatWindowProps {
  chat: { id: number; name: string } | null;
  selectedChatId: number | null;
}

export const mockMembersList: MembersInfo[] = [
  { url: firstUser, online: false, username: 'Diana' },
  { url: secondUser, online: true, username: 'Tie' },
  { url: thirdUser, online: false, username: 'Ryan' },
  { url: '', online: true, username: 'Sam' },
];


const ChatWindow = ({ chat, selectedChatId }: ChatWindowProps) => {
 return (
    <div style={{ width: '70%', padding: '20px', color: 'white' }}>
      {selectedChatId === -1 ? (
        <div>
          <p>Placeholder for creating a new chat</p>
        </div>
      ) : chat ? (
        <ChatSideBar members={mockMembersList} />
      ) : (
        <p>Select a chat to view messages</p>
      )}
    </div>
  );
};

export default ChatWindow;
