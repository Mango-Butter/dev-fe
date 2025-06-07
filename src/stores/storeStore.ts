// src/stores/storeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreSummaryBoss } from "../types/store.ts";

interface StoreState {
  selectedStore: StoreSummaryBoss | null;
  setSelectedStore: (store: StoreSummaryBoss) => void;
  clearSelectedStore: () => void;
}

const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedStore: null,
      setSelectedStore: (store) => set({ selectedStore: store }),
      clearSelectedStore: () => set({ selectedStore: null }),
    }),
    {
      name: "selected-store",
    },
  ),
);

export default useStoreStore;
