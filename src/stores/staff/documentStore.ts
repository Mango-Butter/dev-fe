import { create } from "zustand";
import { StaffDocumentSummary } from "../../types/document.ts";
import useStaffStoreStore from "../useStaffStoreStore.ts";
import { getStaffDocumentSummary } from "../../api/staff/document.ts";

interface DocumentStore {
  documents: StaffDocumentSummary[];
  loading: boolean;
  fetchDocuments: () => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  loading: true,
  fetchDocuments: async () => {
    const { selectedStore } = useStaffStoreStore.getState();
    if (!selectedStore) return;

    set({ loading: true });

    try {
      const data = await getStaffDocumentSummary(selectedStore.storeId);
      const requiredDocs = data.filter((doc) => doc.isRequired);
      set({ documents: requiredDocs });
    } catch (e) {
      console.error("서류 목록 조회 실패", e);
    } finally {
      set({ loading: false });
    }
  },
}));
