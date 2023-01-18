import { Box, SvgIcon } from '@mui/material';
import { Menu, MenuButton, MenuButtonProps, MenuProps } from '@szhsin/react-menu';
import React from 'react';
import { FiMoreVertical } from 'react-icons/all';
import useMenuStyle from 'hooks/useMenuStyle';
import styles from 'styles/Common.module.scss';

interface ActionMenuButtonProps extends MenuButtonProps{
  open: boolean;
  width: number;
}

const ActionMenuButton = React.forwardRef((
  { open, width, onClick, onKeyDown }: ActionMenuButtonProps,
  ref,
) => (
  <MenuButton
    className={styles['action-menu-button']}
    ref={ref}
    onClick={onClick}
    onKeyDown={onKeyDown}
  >
    <Box
      alignItems="center"
      color={open ? 'text.primary' : 'text.secondary'}
      display="flex"
      height={32}
      justifyContent="center"
      sx={{
        '&:hover': {
          color: 'text.primary',
        },
      }}
      width={width}
    >
      <SvgIcon>
        <FiMoreVertical />
      </SvgIcon>
    </Box>
  </MenuButton>
));

interface ActionMenuProps extends MenuProps {
  // eslint-disable-next-line react/require-default-props
  style?: React.CSSProperties;
  width: number;
}

const ActionMenu = ({ children, style, width, ...props }: Omit<ActionMenuProps, 'menuButton'>) => {
  const menuStyle = useMenuStyle();
  return (
    <Menu
      transition
      menuButton={({ open }) => <ActionMenuButton open={open} width={width} />}
      menuStyle={{ ...menuStyle, ...style }}
      {...props}
    >
      {children}
    </Menu>
  );
};

export default ActionMenu;
