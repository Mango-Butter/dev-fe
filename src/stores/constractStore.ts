// src/stores/contractStore.ts
import { create } from "zustand";

interface ContractState {
  selectedStaffId: string | null;
  setSelectedStaffId: (id: string) => void;
  clearContractInfo: () => void;
}

const useContractStore = create<ContractState>((set) => ({
  selectedStaffId: null,
  setSelectedStaffId: (id) => set({ selectedStaffId: id }),
  clearContractInfo: () => set({ selectedStaffId: null }),
}));

export default useContractStore;
