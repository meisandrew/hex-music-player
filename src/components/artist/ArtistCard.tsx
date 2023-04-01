import { SvgIcon } from '@mui/material';
import React from 'react';
import { IoMdMicrophone } from 'react-icons/all';
import { Link } from 'react-router-dom';
import { Artist, Library } from 'api/index';
import { MotionBox } from 'components/motion-components/motion-components';
import { imageMotion } from 'components/motion-components/motion-variants';
import { Subtitle, Title } from 'components/typography/TitleSubtitle';
import { ArtistPreview } from 'routes/genre/Genre';
import styles from 'styles/MotionImage.module.scss';
import { CardMeasurements } from 'types/interfaces';
import { isArtist } from 'types/type-guards';

interface ArtistCardProps {
  artist: Artist | ArtistPreview;
  children?: React.ReactNode;
  handleContextMenu: (event: React.MouseEvent<HTMLDivElement>) => void;
  library: Library;
  measurements: CardMeasurements;
  menuTarget: Artist[];
  open?: boolean;
  onClick?: () => void;
}

const ArtistCard = ({
  artist,
  children,
  handleContextMenu,
  library,
  measurements,
  menuTarget,
  open,
  onClick,
}: ArtistCardProps) => {
  const menuOpen = menuTarget.length > 0 && menuTarget.map((el) => el.id).includes(artist.id);
  const thumbSrc = library.api.getAuthenticatedUrl(
    '/photo/:/transcode',
    {
      url: artist.thumb, width: 300, height: 300, minSize: 1, upscale: 1,
    },
  );

  return (
    <MotionBox
      className={styles.container}
      data-id={artist.id}
      height={measurements.ROW_HEIGHT}
      key={artist.id}
      sx={{
        backgroundColor: open || menuOpen ? 'var(--mui-palette-action-selected)' : '',
        borderRadius: '32px',
        contain: 'paint',
        '&:hover': {
          backgroundColor: open || menuOpen ? 'var(--mui-palette-action-selected)' : '',
        },
      }}
      whileHover="hover"
      width={measurements.IMAGE_SIZE}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      <MotionBox
        bgcolor="action.selected"
        className={styles.image}
        flexDirection="column-reverse"
        height={(measurements.IMAGE_SIZE * 0.70) - 24}
        margin="12px"
        style={{
          borderRadius: '32px',
          transition: '0.2s',
          '--img': `url(${thumbSrc})`,
        } as React.CSSProperties}
        variants={open || menuOpen ? {} : imageMotion}
        width={measurements.IMAGE_SIZE - 24}
      >
        {!artist.thumb && (
          <SvgIcon
            className="generic-icon"
            sx={{ color: 'common.grey' }}
          >
            <IoMdMicrophone />
          </SvgIcon>
        )}
      </MotionBox>
      <Title marginX="12px" textAlign="center">
        <Link
          className="link"
          state={{
            guid: artist.guid,
            title: artist.title,
          }}
          to={`/artists/${artist.id}`}
        >
          {artist.title}
        </Link>
      </Title>
      <Subtitle
        marginX="12px"
        textAlign="center"
      >
        {isArtist(artist) && artist.genre.slice(0, 2).map(
          (g, i, a) => `${g.tag.toLowerCase()}${i !== a.length - 1 ? ', ' : ''}`,
        )}
        {!isArtist(artist) && (
          artist.viewCount
            ? `${artist.viewCount} ${artist.viewCount > 1 ? 'plays in genre' : 'play in genre'}`
            : 'unplayed'
        )}
      </Subtitle>
      {children}
    </MotionBox>
  );
};

ArtistCard.defaultProps = {
  children: undefined,
  open: false,
  onClick: () => {},
};

export default ArtistCard;
