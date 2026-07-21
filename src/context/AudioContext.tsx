import { createContext, useContext } from 'react';
import { Streams } from '../constants/config';

/**
 * Global audio state shared across the app.
 *
 * The audio engine is react-native-track-player (RNTP), set up in App.tsx.
 * RNTP runs a native playback service, so audio persists across screens,
 * in the background, on the lock screen, and in Android Auto / CarPlay.
 * Screens read state and call play/pause/switchStream/setVolume from here.
 *
 * Lives in its own file (not App.tsx) so screens don't import from the app
 * root — keeps the dependency graph clean and avoids circular imports.
 */

export type StreamType = typeof Streams.imperialValley;

export interface AudioContextType {
  isPlaying: boolean;
  currentStream: StreamType;
  currentShow: string;
  streamError: string | null;
  play: () => void;
  pause: () => void;
  switchStream: (stream: StreamType) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  currentStream: Streams.imperialValley,
  currentShow: 'JP2 Radio',
  streamError: null,
  play: () => {},
  pause: () => {},
  switchStream: () => {},
  volume: 1,
  setVolume: () => {},
});

export const useAudio = () => useContext(AudioContext);
