import { create } from 'zustand';

interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  currentProvider: string;
}

interface PlaybackStore extends PlaybackState {
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setCurrentProvider: (provider: string) => void;
  reset: () => void;
}

const initialState: PlaybackState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  currentProvider: 'vidsrc',
};

export const usePlaybackStore = create<PlaybackStore>((set) => ({
  ...initialState,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setCurrentProvider: (currentProvider) => set({ currentProvider }),
  reset: () => set(initialState),
}));
