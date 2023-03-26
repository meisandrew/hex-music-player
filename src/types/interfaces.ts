import { AlertColor, PaletteMode } from '@mui/material';
import { Account, Device, Library, PlayQueueItem } from 'hex-plex';
import React from 'react';
import { ConnectDragSource } from 'react-dnd';
import { Location } from 'react-router-dom';

export interface AppInfo {
  appName: string;
  appVersion: string;
  hostname: string;
  platform: string;
  version: string;
}

export interface AppSettings {
  albumSort?: { by: string, order: string };
  albumText?: boolean;
  apiKey?: string;
  colorMode?: PaletteMode;
  compactNav?: boolean;
  compactQueue?: boolean,
  dockedQueue?: boolean;
  repeat?: 'repeat-none' | 'repeat-one' | 'repeat-all'
}

export interface AppConfig {
  clientId?: string;
  queueId?: number;
  sectionId?: number;
  serverName?: string;
  token?: string;
}

export interface AuthParams {
  account: Account;
  server: Device;
  library: Library;
}

export interface Filter {
  artist: string;
  exclusions: string[];
}

export interface ElectronAPI {
  maximize: () => void;
  minimize: () => void;
  quit: () => void;
  unmaximize: () => void;
  getAppInfo: () => AppInfo;
  readConfig: (key: string) => AppSettings | AppConfig;
  writeConfig: (key: string, value: any) => AppSettings | AppConfig;
  readFilters: (key: string) => Filter[];
  writeFilters: (key: string, value: any) => Filter[];
  updatePlaying: (key: 'playing', value: boolean) => void;
  receive: (channel: string, func: (action: { event: string }) => void) => () => void;
}

export interface CardMeasurements {
  IMAGE_SIZE: number;
  ROW_HEIGHT: number;
  ROW_WIDTH: number;
}

export interface LocationWithState extends Location {
  state: { guid: string, title: string, sort: string }
}

export interface PlayerState {
  duration?: number;
  isPlaying?: boolean;
  position?: number;
}

export interface RouteParams {
  id: string;
}

export interface Sort {
  by: string;
  order: string;
}

export interface ToastMessage {
  type: AlertColor | undefined;
  text: string;
}

export interface VirtuosoContext {
  drag: ConnectDragSource,
  getFormattedTime: (inMs: number) => string;
  handleClickAway: () => void;
  handleContextMenu: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleRowClick: (event: React.MouseEvent, index: number) => void;
  hoverIndex: React.MutableRefObject<number | null>;
  isPlaying: boolean;
  library: Library;
  nowPlaying: PlayQueueItem | undefined;
  selectedRows: number[];
}
