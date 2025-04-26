import { useEffect, useRef, useState } from "react";
import modalStore from "../../stores/modalStore.ts";
import useClickOutside from "../../hooks/useClickOutside";
import CloseIcon from "../../components/icons/CloseIcon";
import LogoIcon from "../../components/icons/LogoIcon";

export default function Modal() {
  const {
    isModalOpen,
    setModalOpen,
    modalContent,
    closeOnClickOutside,
    title,
  } = modalStore();

  const modalRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useClickOutside(modalRef, () => {
    if (closeOnClickOutside) {
      setModalOpen(false);
    }
  });

  // 배경 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // 스크롤 이벤트 핸들링
  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="max-h-[90vh] w-[94vw] max-w-[28rem] rounded-2xl bg-white p-6 pr-5 tablet:w-[37.5rem] tablet:max-w-none"
      >
        <div className="relative mb-6 flex w-full justify-center items-center">
          {title ? (
            <h1 className="title-1">{title}</h1>
          ) : (
            <LogoIcon theme="text" />
          )}
          <CloseIcon
            className="absolute right-0 top-0 h-8 w-8 cursor-pointer text-gray-500 hover:text-black"
            onClick={() => setModalOpen(false)}
          />
        </div>

        <div
          onScroll={handleScroll}
          className={`relative max-h-[calc(90vh-10rem)] overflow-y-auto ${
            !isScrolling ? "scrollbar-fade" : ""
          }`}
        >
          {modalContent}
        </div>
      </div>
    </div>
  );
}
