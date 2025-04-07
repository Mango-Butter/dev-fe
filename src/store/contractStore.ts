// 🧠 Zustand store (contractStore.ts)
import { create } from "zustand";

interface ContractState {
  step: number;
  contractType: "standard" | "partTime" | null;
  contractTemplate: string;
  formData: Record<string, string>;
  isEditing: boolean;
  signatureDataURL: string | null;
  setStep: (step: number) => void;
  setContractType: (type: "standard" | "partTime") => void;
  setTemplate: (template: string) => void;
  updateForm: (data: Record<string, string>) => void;
  toggleEdit: () => void;
  setSignature: (url: string) => void;
  saveToStore: () => void;
  loadFromStore: () => void;
}

export const useContractStore = create<ContractState>((set) => ({
  step: 1,
  contractType: null,
  contractTemplate: "",
  formData: {},
  isEditing: false,
  signatureDataURL: null,
  setStep: (step) => set({ step }),
  setContractType: (type) => set({ contractType: type }),
  setTemplate: (template) => set({ contractTemplate: template }),
  updateForm: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  toggleEdit: () => set((state) => ({ isEditing: !state.isEditing })),
  setSignature: (url) => set({ signatureDataURL: url }),
  saveToStore: () =>
    set((state) => {
      localStorage.setItem(
        "contractStore",
        JSON.stringify({
          formData: state.formData,
          signatureDataURL: state.signatureDataURL,
        }),
      );
      return {};
    }),
  loadFromStore: () => {
    const saved = localStorage.getItem("contractStore");
    if (saved) {
      const parsed = JSON.parse(saved);
      set({
        formData: parsed.formData || {},
        signatureDataURL: parsed.signatureDataURL || null,
      });
    }
  },
}));
