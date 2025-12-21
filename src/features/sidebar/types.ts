import type { User } from '../chat';
// jei šitas path neveikia, keisk į:
// import type { User } from '../chat/index';

export type TabsComponentProps = {
  items: string[];
};

export type TabProps = {
  value: string;
  key: number;
};

// gali palikti, jei kažkur dar turi mockMembersList
export type MembersInfo = {
  url: string;
  online: boolean;
  username: string;
};

// ✅ Sidebar rodo realius group members iš chatRoom.users
export type SideBarProps = {
  members: User[];
};
