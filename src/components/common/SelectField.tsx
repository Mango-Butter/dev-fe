import { useRef, useState } from "react";
import { cn } from "../../libs"; // 너희 프로젝트 기준
import { cva } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import useClickOutside from "../../hooks/useClickOutside";
import ArrowIcon from "../icons/ArrowIcon.tsx"; // 상대경로로 수정

const selectFieldVariants = cva(
  "flex-col justify-start items-start gap-4 inline-flex w-full",
  {
    variants: {
      size: {
        lg: "[&_button]:h-14 [&_button]:px-6",
        md: "[&_button]:h-12 [&_button]:px-6",
        sm: "[&_button]:h-11 [&_button]:px-4",
      },
    },
  },
);

interface SelectFieldProps {
  title?: string;
  placeholder?: string;
  description?: string;
  size?: "lg" | "md" | "sm";
  required?: boolean;
  disabled?: boolean;
  options: { label: string; value: string }[];
  value: string;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}

export default function SelectField({
  title,
  placeholder = "선택해주세요",
  description,
  size = "md",
  required = false,
  disabled = false,
  options,
  icon,
  value,
  onChange,
}: SelectFieldProps) {
  const selectRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useClickOutside(selectRef, () => setIsOpen(false));
  const variantClass = selectFieldVariants({ size });

  const selectedOptionLabel = options.find((opt) => opt.value === value)?.label;

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={cn(variantClass)}>
      {title && (
        <div className="flex flex-col items-start justify-center gap-2 self-stretch">
          <div className="flex items-center gap-2 w-full justify-start">
            <label className="title-1 text-grayscale-900">{title}</label>
            {required && <span className="title-1 text-warning">*</span>}
            {icon && (
              <div id="icon" className="flex items-center justify-center">
                {icon}
              </div>
            )}
          </div>
          {description && (
            <label className="body-4 text-grayscale-500">{description}</label>
          )}
        </div>
      )}
      <div
        ref={selectRef}
        className="relative flex w-full flex-col items-start gap-1 self-stretch"
      >
        <button
          className={cn(
            "inline-flex w-full items-center justify-between rounded-lg border border-grayscale-300 px-4 py-3",
            "transition-colors",
            {
              "border-grayscale-500": isOpen,
            },
          )}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          disabled={disabled}
        >
          <span
            className={cn(
              "body-2 mr-2 truncate",
              !value && "text-grayscale-500",
            )}
          >
            {selectedOptionLabel || placeholder}
          </span>
          <motion.span
            className="flex-shrink-0"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowIcon className="h-6 w-6" direction="down" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.ul
              className="absolute z-10 mt-12 w-full overflow-y-scroll max-h-60 rounded-lg border border-grayscale-300 bg-white shadow-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {options.map((opt) => (
                <motion.li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="body-3 cursor-pointer px-4 py-3 hover:bg-grayscale-100"
                >
                  {opt.label}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
