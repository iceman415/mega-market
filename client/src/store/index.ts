import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";
import { authService } from "@/services";

type Section = "inventory" | "parts" | "clothing";

interface AppState {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: "inventory",
  setActiveSection: (section) => set({ activeSection: section }),
}));

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => {
        set({ user });
      },
      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // ignore
        }
        set({ user: null });
      },
    }),
    {
      name: "admin-auth",
      storage: typeof window !== "undefined"
        ? createJSONStorage(() => localStorage)
        : undefined,
    },
  ),
);
