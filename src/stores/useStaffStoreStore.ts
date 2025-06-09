// src/stores/useStaffStoreStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StaffStore } from "../types/store.ts";

interface StaffStoreState {
  selectedStore: StaffStore | null;
  setSelectedStore: (store: StaffStore) => void;
  clearSelectedStore: () => void;
}

const useStaffStoreStore = create<StaffStoreState>()(
  persist(
    (set) => ({
      selectedStore: null,
      setSelectedStore: (store) => set({ selectedStore: store }),
      clearSelectedStore: () => set({ selectedStore: null }),
    }),
    {
      name: "selected-staff-store", // localStorage 키
    },
  ),
);

export default useStaffStoreStore;
