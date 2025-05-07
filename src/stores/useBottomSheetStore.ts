// stores/useBottomSheetStore.ts
import { create } from "zustand";

type BottomSheetStore = {
  isBottomSheetOpen: boolean;
  bottomSheetContent: React.ReactNode | null;
  title: string;
  leftButtonIcon: React.ReactNode | null;
  rightButtonIcon: React.ReactNode | null;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
  closeOnClickOutside: boolean;
  onClose?: () => void;
  setBottomSheetOpen: (isOpen: boolean) => void;
  setBottomSheetContent: (
    content: React.ReactNode,
    options?: Partial<{
      title: string;
      leftButtonIcon: React.ReactNode;
      rightButtonIcon: React.ReactNode;
      onLeftButtonClick: () => void;
      onRightButtonClick: () => void;
      closeOnClickOutside: boolean;
      onClose: () => void;
    }>,
  ) => void;
};

const useBottomSheetStore = create<BottomSheetStore>((set) => ({
  isBottomSheetOpen: false,
  bottomSheetContent: null,
  title: "",
  leftButtonIcon: null,
  rightButtonIcon: null,
  closeOnClickOutside: true,
  onLeftButtonClick: undefined,
  onRightButtonClick: undefined,
  onClose: undefined,
  setBottomSheetOpen: (isOpen) => set({ isBottomSheetOpen: isOpen }),
  setBottomSheetContent: (content, options = {}) =>
    set({
      isBottomSheetOpen: true,
      bottomSheetContent: content,
      ...options,
    }),
}));

export default useBottomSheetStore;
