import { cn } from "../../libs";
import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const labelVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-lg min-w-fit",
  {
    variants: {
      theme: {
        indigo: "bg-secondary-900 text-white",
        solid: "bg-primary-600 text-white",
        lightsolid: "bg-white text-primary-900 border-2 border-primary-300",
        lightsecond: "bg-white text-secondary-900 border border-secondary-300",
        graysolid: "bg-grayscale-100 text-grayscale-900",
        ghost: "border border-grayscale-500 text-grayscale-800",
      },
      size: {
        lg: "h-8 px-3 py-[0.438rem] text-sm font-medium",
        sm: "h-6 px-2 py-1 body-3",
      },
    },
    defaultVariants: {
      theme: "solid",
      size: "sm",
    },
  },
);

export interface LabelProps extends ComponentProps<"div"> {
  theme?:
    | "indigo"
    | "solid"
    | "lightsolid"
    | "lightsecond"
    | "graysolid"
    | "ghost";
  size?: "lg" | "sm";
  icon?: ReactNode;
}

export default function Label({
  className,
  theme = "solid",
  size = "sm",
  icon,
  children,
  ...props
}: LabelProps) {
  return (
    <div
      className={cn(labelVariants({ theme, size }), className)}
      {...props}
      ref={undefined}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <p>{children}</p>
    </div>
  );
}
