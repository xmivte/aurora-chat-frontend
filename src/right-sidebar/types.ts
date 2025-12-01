export type TabsComponentProps = {
  items: string[];
};

export type TabProps = {
  value: string;
  key: number;
};

export type MembersInfo = {
  url: string;
  online: boolean;
  username: string;
};

export type SideBarProps = {
  members: MembersInfo[];
};
