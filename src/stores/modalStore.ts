import { create } from "zustand";

type ModalStore = {
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  closeOnClickOutside: boolean;
  title: string;
  setModalOpen: (isOpen: boolean) => void;
  setModalContent: (
    content: React.ReactNode,
    options?: {
      closeOnClickOutside?: boolean;
      title?: string;
    },
  ) => void;
};

const modalStore = create<ModalStore>()((set) => ({
  isModalOpen: false,
  modalContent: null,
  closeOnClickOutside: true,
  title: "",
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setModalContent: (content, options = {}) =>
    set({
      modalContent: content,
      closeOnClickOutside: options.closeOnClickOutside ?? true,
      isModalOpen: true,
      title: options.title ?? "",
    }),
}));

export default modalStore;
