import type { User } from '../chat';

export type TabsComponentProps = {
  items: string[];
};

export type TabProps = {
  value: string;
  key: number;
};

export type MembersInfo = {
  id: string;
  url: string;
  online: boolean;
  username: string; 
};

export type SideBarProps = {
  members: User[];
};
