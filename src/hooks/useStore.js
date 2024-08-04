import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    set => ({
      status: "idle",

      setStatus: newStatus => set({ status: newStatus }),
    }),
    {
      name: "timer-storage",
      getStorage: () => localStorage,
    }
  )
);
