/* eslint-disable react/no-array-index-key */
import { Skeleton, SkeletonProps } from '@mui/material';
import { Column } from '@tanstack/react-table';
import React from 'react';
import { PlaylistItem, Track } from 'api/index';
import { styles } from 'components/track-table';

const skeletonPropsMap: Partial<Record<keyof Track, Partial<SkeletonProps>[]>> = {
  distance: [{ variant: 'text', width: '50%' }],
  duration: [{ sx: { ml: 'auto' }, variant: 'text', width: 50 }],
  grandparentTitle: [{ variant: 'text', width: '50%' }],
  index: [{ sx: { display: 'none' } }],
  lastViewedAt: [{ variant: 'text', width: 88 }],
  originallyAvailableAt: [{ variant: 'text', width: '70%' }],
  originalTitle: [{ variant: 'text', width: '70%' }],
  parentIndex: [{ sx: { display: 'none' } }],
  parentTitle: [{ variant: 'text', width: '50%' }],
  parentYear: [{ variant: 'text', width: 40 }],
  thumb: [{ height: 40, sx: { margin: 'auto' }, variant: 'rounded', width: 40 }],
  title: [
    { variant: 'text', width: '50%' },
    { variant: 'text', width: '40%' },
  ],
  userRating: [
    { sx: { ml: 'auto' }, variant: 'text', width: 75 },
    { sx: { ml: 'auto' }, variant: 'text', width: 60 },
  ],
  viewCount: [{ variant: 'text', width: 64 }],
};

const TrackTablePlaceholder: React.FC<{
  columns: Column<PlaylistItem, unknown>[] | Column<Track, unknown>[],
  compact: boolean,
  groupingColumnId: string,
  singleLineRating: boolean,
  singleLineTitle: boolean,
}> = ({ columns, compact, groupingColumnId, singleLineRating, singleLineTitle }) => {
  if (groupingColumnId === 'parentId') {
    return (
      <tr style={{ height: 216, pointerEvents: 'none' }}>
        <td colSpan={100} style={{ height: 216, padding: 0 }}>
          <div
            style={{
              alignItems: 'flex-end',
              display: 'flex',
              height: '100%',
            }}
          >
            <Skeleton height={152} sx={{ mb: 2 }} variant="rounded" width={152} />
            <div style={{ marginBottom: '13px' }}>
              <Skeleton sx={{ mb: '2px', ml: 2 }} variant="text" width={80} />
              <Skeleton height={40} sx={{ ml: 2 }} variant="text" width={256} />
              <Skeleton
                sx={{ position: 'relative', top: '2px', mt: '2px', ml: 2 }}
                variant="text"
                width={184}
              />
            </div>
          </div>
        </td>
      </tr>
    );
  }
  if (groupingColumnId === 'parentIndex') {
    return (
      <tr style={{ height: compact ? 40 : 56, pointerEvents: 'none' }}>
        <td colSpan={100}>
          <Skeleton sx={{ marginLeft: '16px' }} variant="text" width="10%" />
        </td>
      </tr>
    );
  }
  if (groupingColumnId === 'parentRatingKey') {
    return (
      <tr className={styles.row} style={{ height: 30, pointerEvents: 'none' }}>
        {columns.map((column) => {
          if (
            ((column.id === 'title' || column.id === 'userRating') && compact)
            || (column.id === 'title' && singleLineTitle)
            || (column.id === 'userRating' && singleLineRating)
          ) {
            return (
              <td key={column.id}>
                <Skeleton {...skeletonPropsMap[column.id as keyof Track]![0]} />
              </td>
            );
          }
          return (
            <td key={column.id}>
              {skeletonPropsMap[column.id as keyof Track]?.map((props, index) => (
                <Skeleton key={index} {...props} />
              ))}
            </td>
          );
        })}
      </tr>
    );
  }
  return (
    <tr className={styles.row} style={{ height: compact ? 40 : 56, pointerEvents: 'none' }}>
      {columns.map((column) => {
        if (
          ((column.id === 'title' || column.id === 'userRating') && compact)
          || (column.id === 'title' && singleLineTitle)
          || (column.id === 'userRating' && singleLineRating)
        ) {
          return (
            <td key={column.id}>
              <Skeleton {...skeletonPropsMap[column.id as keyof Track]![0]} />
            </td>
          );
        }
        return (
          <td key={column.id}>
            {skeletonPropsMap[column.id as keyof Track]?.map((props, index) => (
              <Skeleton key={index} {...props} />
            ))}
          </td>
        );
      })}
    </tr>
  );
};

export default TrackTablePlaceholder;
