// src/stores/storeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreSummaryBoss } from "../types/store.ts";

interface StoreState {
  selectedStore: StoreSummaryBoss | null;
  setSelectedStore: (store: StoreSummaryBoss) => void;
}

const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedStore: null,
      setSelectedStore: (store) => set({ selectedStore: store }),
    }),
    {
      name: "selected-store", // localStorage key
    },
  ),
);

export default useStoreStore;
