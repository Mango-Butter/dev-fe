// src/stores/storeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreSummary } from "../api/store";

interface StoreState {
  selectedStore: StoreSummary | null;
  setSelectedStore: (store: StoreSummary) => void;
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
