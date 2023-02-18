import { Box, ListItem, Typography } from '@mui/material';
import { MenuState } from '@szhsin/react-menu';
import { Playlist, PlaylistItem, PlayQueueItem, Track } from 'hex-plex';
import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { NavLink } from 'react-router-dom';
import {
  navlistBoxStyle,
  navlistActiveBox,
  navlistTypeActiveStyle,
  navlistTypeStyle,
} from 'constants/style';
import { useAddToPlaylist } from 'hooks/playlistHooks';
import { DragTypes } from 'types/enums';

interface PlaylistLinkProps {
  handleContextMenu: (event: React.MouseEvent) => void;
  menuState: MenuState | undefined;
  menuTarget: number | undefined;
  playlist: Playlist;
}

const PlaylistLink = ({
  handleContextMenu, menuState, menuTarget, playlist,
}: PlaylistLinkProps) => {
  const addToPlaylist = useAddToPlaylist();

  const handleDrop = useCallback(async (
    array: any[],
    itemType: null | string | symbol,
  ) => {
    let tracks;
    if (itemType === DragTypes.PLAYLIST_ITEM || itemType === DragTypes.PLAYQUEUE_ITEM) {
      tracks = array.map((item) => item.track) as Track[];
    } else {
      tracks = array as Track[];
    }
    await addToPlaylist(playlist.id, tracks.map((track) => track.id));
  }, [addToPlaylist, playlist.id]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [
      DragTypes.PLAYLIST_ITEM,
      DragTypes.PLAYQUEUE_ITEM,
      DragTypes.TRACK,
    ],
    drop: (
      item: PlaylistItem[] | PlayQueueItem[] | Track[],
      monitor,
    ) => handleDrop(item, monitor.getItemType()),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [playlist]);

  return (
    <Box data-id={playlist.id} onContextMenu={(event) => handleContextMenu(event)}>
      <NavLink
        className="nav-link"
        ref={!playlist.smart ? drop : null}
        to={`/playlists/${playlist.id}`}
      >
        {({ isActive }) => (
          <ListItem
            sx={{
              ...navlistBoxStyle,
              ml: playlist.smart ? '34px' : '12px',
              border: '1px solid',
              borderColor: isOver ? 'var(--mui-palette-info-main)' : 'transparent',
              borderRadius: '4px',
            }}
          >
            <Box sx={navlistActiveBox(isActive)} />
            <Typography
              sx={isActive || (menuState === 'open' && menuTarget === playlist.id)
                ? navlistTypeActiveStyle
                : navlistTypeStyle}
            >
              {playlist.title}
            </Typography>
          </ListItem>
        )}
      </NavLink>
    </Box>
  );
};

export default React.memo(PlaylistLink);
