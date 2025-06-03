import { useEffect, useRef, useState, ReactNode } from "react";
import useClickOutside from "./useClickOutside";

interface TooltipOptions {
  duration?: number;
  position?: "top" | "bottom" | "left" | "right";
}

export const useTooltip = (options?: TooltipOptions) => {
  const duration = options?.duration ?? 3000;
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useClickOutside(tooltipRef, () => setVisible(false));

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const toggleTooltip = () => setVisible((prev) => !prev);

  const TooltipBox = ({ children }: { children: ReactNode }) => {
    if (!visible) return null;

    return (
      <div
        className="absolute top-full left-1/6 mt-2 z-20
             bg-black text-white body-4 rounded p-2 shadow-md
             animate-slide-down text-center w-max"
        ref={tooltipRef}
      >
        {children}
      </div>
    );
  };

  return {
    showTooltip: visible,
    toggleTooltip,
    setTooltip: setVisible,
    TooltipBox,
    tooltipRef,
  };
};
