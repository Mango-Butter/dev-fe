// components/common/BottomSheet.tsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useBottomSheetStore from "../../stores/useBottomSheetStore.ts";
import useScrollLock from "../../hooks/useScrollLock.ts";
import CloseIcon from "../icons/CloseIcon.tsx";
import ArrowIcon from "../icons/ArrowIcon.tsx";
import MobileHeader from "./MobileHeader.tsx";

const BottomSheet = () => {
  const {
    isBottomSheetOpen,
    setBottomSheetOpen,
    title,
    leftButtonIcon,
    rightButtonIcon,
    bottomSheetContent,
    onLeftButtonClick,
    onRightButtonClick,
    closeOnClickOutside,
    onClose,
  } = useBottomSheetStore();

  const modalRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useScrollLock(isBottomSheetOpen);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current?.contains(e.target as Node)) return;
    if (closeOnClickOutside) {
      onClose?.();
      setBottomSheetOpen(false);
    }
  };

  const handleRightButtonClick = () => {
    if (rightButtonIcon) {
      onRightButtonClick?.();
    } else {
      setBottomSheetOpen(false);
      onClose?.();
    }
  };

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>("[data-footer]");
    if (footer) {
      setFooterHeight(footer.getBoundingClientRect().height);
    }
  }, [isBottomSheetOpen]);

  return (
    <AnimatePresence>
      {isBottomSheetOpen && (
        <div
          className="fixed inset-0 z-40 h-screen w-full"
          onClick={handleOverlayClick}
        >
          <div className="absolute inset-0 bg-black/50" />
          <motion.div
            ref={modalRef}
            className="fixed bottom-0 left-0 right-0 flex w-full flex-col overflow-hidden rounded-t-2xl bg-white"
            style={{
              maxHeight: "calc(100vh - 80px)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <MobileHeader
              title={title}
              leftIcon={
                leftButtonIcon || (
                  <ArrowIcon direction="left" className="text-transparent" />
                )
              }
              onLeftClick={onLeftButtonClick}
              rightIcon={rightButtonIcon || <CloseIcon />}
              onRightClick={handleRightButtonClick}
              className="sticky top-0 z-10 bg-white"
            />
            <div
              className="w-full overflow-y-auto p-5"
              style={{ paddingBottom: `${footerHeight + 20}px` }}
            >
              {bottomSheetContent}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
