import { create } from 'zustand';

type Section = 'inventory' | 'parts';

interface AppState {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: 'inventory',
  setActiveSection: (section) => set({ activeSection: section }),
}));