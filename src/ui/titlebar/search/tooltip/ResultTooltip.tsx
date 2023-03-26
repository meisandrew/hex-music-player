import {
  SvgIcon, Tooltip, Zoom,
} from '@mui/material';
import React from 'react';
import { BiChevronRight } from 'react-icons/all';
import { Result } from 'types/types';
import TooltipMenu from './TooltipMenu';

interface Props {
  color: 'text.primary' | 'common.black'
  result: Result;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTooltipOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tooltipOpen: boolean;
}

const ResultTooltip = ({
  color, result, tooltipOpen, setOpen, setTooltipOpen,
}: Props) => (
  <Tooltip
    arrow
    TransitionComponent={Zoom}
    componentsProps={{
      tooltip: {
        sx: {
          width: '152px',
          left: '-2px',
          padding: '5px 5px',
          backgroundColor: 'background.paper',
          backgroundImage: 'var(--mui-overlays-9)',
          boxShadow: 'var(--mui-shadows-8)',
          '& .MuiTooltip-arrow': {
            '&::before': {
              backgroundColor: 'background.paper',
              backgroundImage: 'var(--mui-overlays-9)',
            },
          },
        },
      },
    }}
    enterDelay={300}
    enterNextDelay={300}
    open={tooltipOpen}
    placement="right"
    sx={{ pointerEvents: 'auto' }}
    title={(
      <TooltipMenu
        result={result}
        setOpen={setOpen}
        setTooltipOpen={setTooltipOpen}
      />
    )}
    onClose={() => {
      setTooltipOpen(false);
      document.querySelector('.titlebar')?.classList.remove('titlebar-nodrag');
    }}
    onOpen={() => {
      setTooltipOpen(true);
      document.querySelector('.titlebar')?.classList.add('titlebar-nodrag');
    }}
  >
    <SvgIcon sx={{ color, height: '48px' }}>
      <BiChevronRight />
    </SvgIcon>
  </Tooltip>
);

export default ResultTooltip;
