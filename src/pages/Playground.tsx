import avatar from '../assets/ChatWindowTest.png';
import ChatWindow from '../components/ChatWindow';
import { Chat } from '../types/index';
import { Message } from '../types/index';

const twoDaysBefore = new Date();
twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

const messages: Message[] = [
  {
    id: 1,
    user: {
      name: 'Alice',
      id: 1,
      pictureUrl: undefined,
    },
    content: 'Hello, how are you?',
    date: twoDaysBefore,
  },
  {
    id: 2,
    user: {
      name: 'Bob',
      id: 2,
      pictureUrl: undefined,
    },
    content: 'Im good, thanks!',
    date: new Date(),
  },
  {
    id: 3,
    user: {
      name: 'Charlie',
      id: 3,
      pictureUrl: undefined,
    },
    content: 'Hey everyone!',
    date: new Date(),
  },
  {
    id: 4,
    user: {
      name: 'Bob',
      id: 2,
      pictureUrl: undefined,
    },
    content: 'Im good, thanks!',
    date: new Date(),
  },
  {
    id: 5,
    user: {
      name: 'Charlie',
      id: 3,
      pictureUrl: undefined,
    },
    content: 'Hey everyone!',
    date: new Date(),
  },
];

const chatRoom: Chat = {
  name: undefined,
  pictureUrl: avatar,
  users: [
    {
      name: 'Alice',
      id: 1,
      pictureUrl: undefined,
    },
    {
      name: 'Bob',
      id: 2,
      pictureUrl: undefined,
    },
    {
      name: 'Charlie',
      id: 3,
      pictureUrl: undefined,
    },
  ],
};
const curretUserId = 1;

function Playground() {
  return (
    <div>
      <h1>Compont preview</h1>
      <ChatWindow curretUserId={curretUserId} chatRoom={chatRoom} messages={messages} />
    </div>
  );
}
export default Playground;
