import { Box } from '@mui/material';
import React from 'react';
import TrackRow from 'components/track/TrackRow';
import useRowSelection from 'hooks/useRowSelection';
import { RowProps } from './Album';

const Row = React.memo(({ context, index, track }: RowProps) => {
  const { isRowSelected, toggleRowSelection } = useRowSelection();
  const {
    getFormattedTime,
    hoverIndex,
    isPlaying,
    library,
    nowPlaying,
    playAlbumAtTrack,
  } = context;

  const playing = nowPlaying?.track.id === track.id;
  const selected = isRowSelected(index);

  const handleDoubleClick = async () => {
    await playAlbumAtTrack(track, false);
  };

  const handleMouseEnter = () => {
    hoverIndex.current = index;
  };

  return (
    <Box
      alignItems="center"
      color="text.secondary"
      display="flex"
      height={56}
      onMouseEnter={handleMouseEnter}
    >
      <Box
        alignItems="center"
        className={`track ${selected ? 'selected' : ''}`}
        data-item-index={index}
        display="flex"
        height={52}
        onClick={(event) => toggleRowSelection(index, event)}
        onDoubleClick={handleDoubleClick}
      >
        <TrackRow
          getFormattedTime={getFormattedTime}
          index={track.trackNumber}
          isPlaying={isPlaying}
          library={library}
          options={{ showAlbumTitle: false, showArtwork: false }}
          playing={playing}
          track={track}
        />
      </Box>
    </Box>
  );
});

export default Row;
