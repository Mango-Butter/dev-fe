import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../libs";

const textFieldVariants = cva(
  "flex-col justify-start items-start gap-2 inline-flex w-full",
  {
    variants: {
      state: {
        none: "[&_input]:text-grayscale-900 [&_input]:placeholder:text-grayscale-500 [&_input]:border-grayscale-300",
        warning:
          "[&_input]:text-grayscale-900 [&_input]:placeholder:text-grayscale-500 [&_input]:border-warning [&_#helperText]:text-warning",
        correct:
          "[&_input]:text-grayscale-900 [&_input]:placeholder:text-grayscale-500 [&_input]:border-positive [&_#helperText]:text-positive",
        active:
          "[&_input]:text-grayscale-900 [&_input]:placeholder:text-grayscale-500 [&_input]:border-grayscale-500",
        disable:
          "[&_input]:text-grayscale-500 [&_input]:placeholder:text-grayscale-500 [&_input]:border-grayscale-300 [&_input]:bg-gray-50",
      },
      size: {
        lg: "[&_input]:h-14 body-1 [&_input]:px-6",
        md: "[&_input]:h-12 body-1 [&_input]:px-6",
        sm: "[&_input]:body-2 [&_input]:px-4",
      },
    },
    defaultVariants: {
      state: "none",
      size: "md",
    },
  },
);

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  title?: string;
  description?: string;
  helperText?: string;
  state?: "none" | "warning" | "correct" | "active" | "disable";
  size?: "lg" | "md" | "sm";
  required?: boolean;
  button?: React.ReactNode;
  inputClassName?: string;
  theme?: "basic" | "suffix" | "icon";
  suffix?: string | React.ReactNode;
  icon?: React.ReactNode;
  handleIconClick?: () => void;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      title,
      description,
      placeholder,
      state = "none",
      size = "md",
      helperText,
      value,
      onChange,
      required = false,
      button,
      inputClassName,
      theme = "basic",
      suffix,
      icon,
      handleIconClick,
      ...props
    },
    ref,
  ) => {
    const variantClass = textFieldVariants({ state, size });

    return (
      <div className={cn(variantClass, className)}>
        {title && (
          <div className="flex flex-col items-start self-stretch">
            <div className="flex items-center gap-1">
              <label className="title-1 text-grayscale-900">{title}</label>
              {required && <span className="title-1 text-warning">*</span>}
            </div>
            {description && (
              <span className="body-2 text-grayscale-700">{description}</span>
            )}
          </div>
        )}
        <div className="flex w-full flex-col items-start gap-1 self-stretch">
          <div className="inline-flex w-full gap-2">
            <div className="relative flex w-full items-center">
              <input
                ref={ref}
                className={cn(
                  "w-full rounded-lg border px-5 py-3 body-1 transition-colors",
                  suffix && "pr-12",
                  state === "disable" && "overflow-x-auto",
                  inputClassName,
                )}
                readOnly={state === "disable"}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                {...props}
              />
              {theme === "suffix" && suffix && (
                <span className="pointer-events-none absolute right-4 text-grayscale-700">
                  {suffix}
                </span>
              )}
              {theme === "icon" && icon && (
                <span
                  className="absolute right-4 cursor-pointer text-grayscale-700"
                  onClick={handleIconClick}
                >
                  {icon}
                </span>
              )}
            </div>
            {button && <>{button}</>}
          </div>
          {helperText && (state === "correct" || state === "warning") && (
            <span id="helperText" className="body-2 self-stretch">
              {helperText}
            </span>
          )}
        </div>
      </div>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
