import {
  Avatar, Box, SvgIcon, Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { IoMdMicrophone } from 'react-icons/all';
import { Link } from 'react-router-dom';
import usePalette, { defaultColors } from 'hooks/usePalette';
import { useLibrary, useSettings } from 'queries/app-queries';
import { DragTypes, PlexSortKeys, SortOrders } from 'types/enums';
import { isAlbum, isArtist, isTrack } from 'types/type-guards';
import styles from '../Search.module.scss';
import ResultTooltip from '../tooltip/ResultTooltip';
import TopResultButtons from './TopResultButtons';
import type { Result } from 'types/types';

const typographyStyle = {
  overflow: 'hidden',
  marginLeft: '9px',
  lineHeight: 1.2,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
};

const textStyle = {
  backgroundColor: 'grey.800',
  color: 'common.white',
  borderRadius: '4px',
  position: 'absolute',
  bottom: 9,
  left: 9,
  paddingX: '3px',
  paddingY: '2px',
};

const getDragType = (resultType: string) => {
  switch (resultType) {
    case 'artist':
      return DragTypes.ARTIST;
    case 'album':
      return DragTypes.ALBUM;
    case 'track':
      return DragTypes.TRACK;
    default: throw new Error('no matching type');
  }
};

interface TopResultProps {
  topResult: Result;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopResult = ({ topResult, setOpen }: TopResultProps) => {
  const library = useLibrary();
  const [isHovered, setHovered] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { data: settings } = useSettings();
  const { colorMode } = settings;

  const thumbSrc = topResult.thumb
    ? library.api.getAuthenticatedUrl(
      '/photo/:/transcode',
      {
        url: topResult.thumb, width: 300, height: 300, minSize: 1, upscale: 1,
      },
    )
    : '';
  const thumbUrl = library.api.getAuthenticatedUrl(topResult.thumb);
  const { data: palette, isError } = usePalette(topResult.thumb, thumbUrl);

  const [, drag, dragPreview] = useDrag(() => ({
    type: getDragType(topResult.type),
    item: [topResult],
  }), [topResult]);

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreview, topResult]);

  const additionalText = useMemo(() => {
    if (isArtist(topResult)) {
      return topResult.childCount > 1
        ? `${topResult.childCount} releases`
        : `${topResult.childCount} release`;
    }
    if (isAlbum(topResult)) {
      return topResult.parentTitle;
    }
    if (isTrack(topResult)) {
      return topResult.originalTitle
        ? topResult.originalTitle
        : topResult.grandparentTitle;
    }
    throw new Error('no matching type');
  }, [topResult]);

  const linkState = useMemo(() => {
    if (isArtist(topResult)) {
      return {
        guid: topResult.guid,
        title: topResult.title,
        sort: [
          PlexSortKeys.RELEASE_DATE,
          SortOrders.DESC,
        ].join(''),
      };
    }
    if (isAlbum(topResult)) {
      return { guid: topResult.parentGuid, title: topResult.parentTitle };
    }
    if (isTrack(topResult)) {
      return { guid: topResult.grandparentGuid, title: topResult.grandparentTitle };
    }
    throw new Error('no matching type');
  }, [topResult]);

  const fontSize = useMemo(() => {
    switch (true) {
      case topResult.title.length > 55:
        return '1.4rem';
      case topResult.title.length > 35:
        return '1.6rem';
      case topResult.title.length > 15:
        return '1.8rem';
      case topResult.title.length <= 15:
        return '2.0rem';
      default: return '2.0rem';
    }
  }, [topResult.title.length]);

  const resultType = useMemo(() => {
    switch (topResult.type) {
      case 'artist':
        return (
          <Typography fontSize="0.75rem" letterSpacing="0.5px" sx={textStyle}>artist</Typography>
        );
      case 'album':
        return (
          <Typography fontSize="0.75rem" letterSpacing="0.5px" sx={textStyle}>album</Typography>
        );
      case 'track':
        return (
          <Typography fontSize="0.75rem" letterSpacing="0.5px" sx={textStyle}>track</Typography>
        );
      case 'playlist':
        return null;
      default:
        return null;
    }
  }, [topResult.type]);

  const backgroundColor = useMemo(() => {
    if (isError || !palette) {
      return colorMode === 'light'
        ? `${defaultColors.lightVibrant}66`
        : `${defaultColors.lightVibrant}e6`;
    }
    return colorMode === 'light'
      ? `${palette.lightVibrant}66`
      : `${palette.lightVibrant}e6`;
  }, [colorMode, isError, palette]);

  return (
    <Box
      className={isHovered ? styles['top-result-box-hover'] : styles['top-result-box']}
      ref={drag}
      sx={{
        borderRadius: '8px',
        backgroundColor,
      }}
      width="auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Typography
        sx={{
          marginLeft: '6px',
          color: 'common.black',
        }}
      >
        Top Result
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          height: '150px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            width: '144px',
            height: '144px',
            borderRadius: topResult.type === 'artist' ? '50%' : '4px',
            marginX: '6px',
            marginBottom: '6px',
            flexShrink: 0,
          }}
        >
          <Avatar
            alt={topResult.title}
            src={thumbSrc}
            sx={{ width: '100%', height: '100%' }}
            variant="square"
          >
            <SvgIcon className="generic-icon" sx={{ color: 'common.black' }}>
              <IoMdMicrophone />
            </SvgIcon>
          </Avatar>
          {resultType}
        </Box>
        <Box
          className={styles['top-result-actions']}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Box
            id="top-result-text"
            sx={{
              overflow: 'hidden',
              marginRight: '3px',
            }}
          >
            <Typography
              sx={{
                ...typographyStyle,
                color: 'common.black',
                fontFamily: 'Rubik, sans-serif',
                fontSize,
                fontWeight: 700,
              }}
            >
              <Link
                className="link"
                state={isArtist(topResult) ? linkState : null}
                to={{
                  artist: isArtist(topResult) ? `/artists/${topResult.id}` : '',
                  album: isAlbum(topResult) ? `/albums/${topResult.id}` : '',
                  track: isTrack(topResult) ? `/albums/${topResult.parentId}` : '',
                }[topResult.type] || '/'}
                onClick={() => setOpen(false)}
              >
                {topResult.title}
              </Link>
            </Typography>
            <Typography
              sx={{
                ...typographyStyle,
                color: 'common.black',
                WebkitLineClamp: 1,
              }}
              variant="subtitle2"
            >
              <Link
                className="link"
                state={linkState}
                to={{
                  artist: isArtist(topResult) ? `/artists/${topResult.id}/discography` : '',
                  album: isAlbum(topResult) ? `/artists/${topResult.parentId}` : '',
                  track: isTrack(topResult) ? `/artists/${topResult.grandparentId}` : '',
                }[topResult.type] || '/'}
                onClick={() => setOpen(false)}
              >
                {additionalText}
              </Link>
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'relative',
              top: '3px',
              height: '44px',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              mb: '6px',
            }}
          >
            <TopResultButtons
              topResult={topResult}
            />
          </Box>
        </Box>
        <Box alignItems="center" display="flex" height="calc(100% + 24px)" width="24px">
          <ResultTooltip
            color="common.black"
            result={topResult}
            setOpen={setOpen}
            setTooltipOpen={setTooltipOpen}
            tooltipOpen={tooltipOpen}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TopResult;
