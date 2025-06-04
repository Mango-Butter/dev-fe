import { cn } from "../../libs";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "justify-center min-w-fit items-center gap-[0.5rem] rounded-lg inline-flex",
  {
    variants: {
      size: {
        xl: "h-14 px-6 py-[0.906rem] title-1",
        lg: "h-14 px-6 py-[0.906rem] body-1",
        md: "h-12 px-5 py-3 title-2",
        sm: "h-11 px-4 py-2 body-2",
        icon_xl: "h-14 w-14 p-4 [&_#icon]:h-6 [&_#icon]:w-6",
        icon_lg: "h-14 w-14 p-4 [&_#icon]:h-6 [&_#icon]:w-6",
        icon_md: "h-12 w-12 p-3 [&_#icon]:h-6 [&_#icon]:w-6",
        icon_sm: "h-11 w-11 p-3.5 [&_#icon]:h-4 [&_#icon]:w-4",
      },
      state: {
        default: "",
        active: "",
        disabled: "",
      },
      theme: {
        primary: "",
        secondary: "",
        ghost: "",
        ghost2: "",
        outline: "",
        text: "",
        danger: "",
      },
    },
    compoundVariants: [
      //state == disabled
      {
        state: "disabled",
        theme: ["secondary", "primary", "danger"],
        className: "bg-grayscale-300 text-white",
      },
      {
        state: "disabled",
        theme: ["ghost", "ghost2", "outline"],
        className: "bg-white border border-grayscale-300 text-grayscale-300",
      },
      {
        state: "disabled",
        theme: "text",
        className: "text-grayscale-300",
      },
      //state == active
      {
        state: "active",
        theme: "primary",
        className: "bg-primary-800 text-white",
      },
      {
        state: "active",
        theme: "secondary",
        className: "bg-secondary-900 text-white",
      },
      {
        state: "active",
        theme: "danger",
        className: "bg-red-800 text-white",
      },
      {
        state: "active",
        theme: "ghost",
        className: "bg-primary-100 text-primary-900 border border-primary-900",
      },
      {
        state: "active",
        theme: "ghost2",
        className:
          "bg-secondary-100 text-secondary-900 border border-secondary-900",
      },
      {
        state: "active",
        theme: "outline",
        className: "bg-grayscale-100 text-black border border-grayscale-500",
      },
      {
        state: "active",
        theme: "text",
        className: "text-black underline",
      },
      //state == default
      {
        state: "default",
        theme: "primary",
        className: "bg-primary-600 text-white",
      },
      {
        state: "default",
        theme: "secondary",
        className: "bg-secondary-900 text-white",
      },
      {
        state: "default",
        theme: "danger",
        className: "bg-red-600 text-white",
      },
      {
        state: "default",
        theme: "ghost",
        className: "bg-white text-primary-900 border border-primary-900",
      },
      {
        state: "default",
        theme: "ghost2",
        className: "bg-white text-secondary-900 border border-secondary-900",
      },
      {
        state: "default",
        theme: "outline",
        className: "bg-white text-black border border-grayscale-300",
      },
      {
        state: "default",
        theme: "text",
        className: "text-black",
      },
    ],
  }
);

export interface ButtonProps extends React.ComponentProps<"button"> {
  size?:
    | "xl"
    | "lg"
    | "md"
    | "sm"
    | "icon_xl"
    | "icon_lg"
    | "icon_md"
    | "icon_sm";
  state?: "default" | "active" | "disabled";
  theme?:
    | "primary"
    | "secondary"
    | "ghost"
    | "ghost2"
    | "outline"
    | "text"
    | "danger";
  icon?: React.ReactNode;
}

export default function Button({
  className,
  size = "sm",
  state = "default",
  theme = "text",
  icon,
  ...props
}: ButtonProps) {
  const variantClass = buttonVariants({
    size,
    state,
    theme,
  });

  return (
    <button {...props} className={cn(variantClass, className)}>
      {icon && (
        <div id="icon" className="flex items-center justify-center">
          {icon}
        </div>
      )}
      {props.children}
    </button>
  );
}
