// src/stores/selectedStaffStore.ts
import { create } from "zustand";

interface SelectedStaffStore {
  selectedStaffId: string | null;
  setSelectedStaffId: (id: string) => void;
  clearSelectedStaff: () => void;
}

const useSelectedStaffStore = create<SelectedStaffStore>((set) => ({
  selectedStaffId: null,
  setSelectedStaffId: (id) => set({ selectedStaffId: id }),
  clearSelectedStaff: () => set({ selectedStaffId: null }),
}));

export default useSelectedStaffStore;
