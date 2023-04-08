import { Box } from '@mui/material';
import AddToPlaylistDrawer from './AddToPlaylistDrawer';
import FilterDrawer from './FilterDrawer';
import LyricsButton from './LyricsButton';
import QueueDrawer from './QueueDrawer';
import VolumeSlider from './VolumeSlider';

const AdditionalButtons = () => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      justifyContent: 'flex-end',
    }}
    width={1}
  >
    <LyricsButton />
    <FilterDrawer />
    <QueueDrawer />
    <VolumeSlider />
    <AddToPlaylistDrawer />
  </Box>
);

export default AdditionalButtons;
