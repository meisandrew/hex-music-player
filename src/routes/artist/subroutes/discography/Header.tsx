import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Menu, MenuButton, MenuButtonProps, MenuItem } from '@szhsin/react-menu';
import React from 'react';
import { FaCaretDown, FaCaretUp, IoMdMicrophone } from 'react-icons/all';
import { NavLink, useOutletContext } from 'react-router-dom';
import { ArtistDiscographyContext } from './Discography';

interface FilterMenuButtonProps extends MenuButtonProps{
  filter: string;
  open: boolean;
}

const FilterMenuButton = React.forwardRef((
  { filter, open, onClick, onKeyDown }: FilterMenuButtonProps,
  ref,
) => (
  <MenuButton
    className="sort"
    ref={ref}
    style={{ marginLeft: 'auto', marginTop: 12 }}
    onClick={onClick}
    onKeyDown={onKeyDown}
  >
    <Box
      alignItems="center"
      color={open ? 'text.primary' : 'text.secondary'}
      display="flex"
      height={32}
      justifyContent="space-between"
      sx={{
        '&:hover': {
          color: 'text.primary',
        },
      }}
      width={160}
    >
      <Typography>
        {filter}
      </Typography>
      <SvgIcon sx={{ height: 16, width: 16 }}>
        {(open ? <FaCaretUp /> : <FaCaretDown />)}
      </SvgIcon>
    </Box>
  </MenuButton>
));

interface FilterMenuItemProps {
  label: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const FilterMenuItem = ({ label, setFilter }: FilterMenuItemProps) => (
  <MenuItem
    onClick={() => setFilter(label)}
  >
    <Box alignItems="center" display="flex" justifyContent="space-between" width={1}>
      {label}
    </Box>
  </MenuItem>
);

// eslint-disable-next-line react/require-default-props
const Header = ({ context }: { context?: ArtistDiscographyContext }) => {
  const { width } = useOutletContext() as { width: number };
  const {
    artist: artistData, filter, filters, library, setFilter,
  } = context!;
  const { artist } = artistData!;
  const thumbSrc = library.api
    .getAuthenticatedUrl(
      '/photo/:/transcode',
      { url: artist.thumb || 'null', width: 100, height: 100 },
    );

  return (
    <Box
      height={71}
      position="fixed"
      top={0}
      width={width}
      zIndex={400}
    >
      <Box
        alignItems="center"
        bgcolor="background.paper"
        color="text.primary"
        display="flex"
        height={71}
        marginX="auto"
        maxWidth="900px"
        paddingX="6px"
        width="89%"
      >
        <Avatar
          alt={artist.title}
          src={artist.thumb ? thumbSrc : ''}
          sx={{ width: 60, height: 60 }}
        >
          <SvgIcon
            className="generic-artist"
            sx={{ alignSelf: 'center', color: 'common.black', height: '65%', width: '65%' }}
          >
            <IoMdMicrophone />
          </SvgIcon>
        </Avatar>
        <Typography
          alignSelf="center"
          fontFamily="TT Commons"
          fontSize="1.75rem"
          fontWeight={600}
          ml="10px"
          variant="h5"
          width={1}
        >
          <NavLink
            className="link"
            state={{ guid: artist.guid, title: artist.title }}
            to={`/artists/${artist.id}`}
          >
            {artist.title}
          </NavLink>
          &nbsp;&nbsp;»&nbsp;&nbsp;
          Discography
        </Typography>
        <Menu
          transition
          align="end"
          menuButton={({ open }) => <FilterMenuButton filter={filter} open={open} />}
        >
          {filters.map((option) => (
            <FilterMenuItem
              key={option}
              label={option}
              setFilter={setFilter}
            />
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
