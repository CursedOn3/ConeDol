import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
}

interface ProfileStore {
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      currentProfile: null,
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      clearProfile: () => set({ currentProfile: null }),
    }),
    {
      name: 'profile-storage',
    }
  )
);
