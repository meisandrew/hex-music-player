import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import TrackRow from 'components/track/TrackRow';
import useRowSelection from 'hooks/useRowSelection';
import { RowProps } from './Playlist';

const Row = React.memo(({ index, item, context }: RowProps) => {
  const { isRowSelected, toggleRowSelection } = useRowSelection();
  const [over, setOver] = useState(false);
  const {
    dropIndex,
    getFormattedTime,
    hoverIndex,
    isPlaying,
    library,
    nowPlaying,
    playlist,
    playPlaylist,
  } = context;
  const { track } = item;
  const { data: isDragging } = useQuery(
    ['is-dragging'],
    () => false,
    {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  const playing = nowPlaying?.track.id === track.id;
  const selected = isRowSelected(index);
  const selectedAbove = isRowSelected(index - 1);
  const selectedBelow = isRowSelected(index + 1);

  const handleDoubleClick = async () => {
    await playPlaylist(playlist!, false, track.key);
  };

  const handleDrop = () => {
    dropIndex.current = index;
    setOver(false);
  };

  const handleMouseEnter = () => {
    hoverIndex.current = index;
  };

  return (
    <Box
      alignItems="center"
      className={over ? 'playlist-track playlist-track-over' : 'playlist-track'}
      color="text.secondary"
      data-smart={playlist?.smart}
      display="flex"
      height={56}
      onClick={(event) => toggleRowSelection(index, event)}
      onDoubleClick={handleDoubleClick}
      onDragEnter={() => setOver(true)}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onMouseEnter={handleMouseEnter}
    >
      <Box
        alignItems="center"
        className={`track ${selected ? 'selected' : ''}`}
        data-dragging={isDragging ? 'true' : 'false'}
        data-item-index={index}
        data-selected-above={selectedAbove}
        data-selected-below={selectedBelow}
        display="flex"
        height={56}
      >
        <TrackRow
          getFormattedTime={getFormattedTime}
          isPlaying={isPlaying}
          library={library}
          options={{ showAlbumTitle: true, showArtwork: true }}
          playing={playing}
          track={track}
        />
      </Box>
    </Box>
  );
});

export default Row;
