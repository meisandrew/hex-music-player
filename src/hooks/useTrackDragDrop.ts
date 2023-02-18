import { PlaylistItem, PlayQueueItem, Track } from 'hex-plex';
import React from 'react';
import { useDrag } from 'react-dnd';
import { DragTypes } from 'types/enums';

const useTrackDragDrop = ({
  hoverIndex,
  items,
  selectedRows,
  type,
}: {
  hoverIndex: React.MutableRefObject<number | null>,
  items: PlaylistItem[] | PlayQueueItem[] | Track[],
  selectedRows: number[],
  type: DragTypes,
}) => {
  const [, drag, dragPreview] = useDrag(() => ({
    type,
    item: () => {
      if (!selectedRows.includes(hoverIndex.current!)) {
        return [items[hoverIndex.current!]];
      }
      if (selectedRows.includes(hoverIndex.current!) && selectedRows.length === 1) {
        return [items[hoverIndex.current!]];
      }
      return selectedRows.map((n) => items[n]);
    },
    canDrag: selectedRows.length <= 10,
  }), [hoverIndex, items, selectedRows]);

  return { drag, dragPreview };
};

export default useTrackDragDrop;
