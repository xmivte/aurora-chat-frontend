import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState } from 'react';

interface ContextMenuProps {
  children: React.ReactNode;
  menuItems: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ children, menuItems }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (onClick: () => void) => {
    onClick();
    handleClose();
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      <Menu
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: position.y, left: position.x }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleMenuItemClick(item.onClick)}
            disabled={item.disabled}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ContextMenu;
