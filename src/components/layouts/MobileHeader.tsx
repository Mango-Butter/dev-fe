import Button from "../common/Button.tsx";
import { cn } from "../../libs";

interface MobileHeaderProps extends React.ComponentProps<"header"> {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  className?: string;
}

const MobileHeader = ({
  title,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
  className,
}: MobileHeaderProps) => {
  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-10 flex w-full items-center justify-between bg-white px-5 py-3",
        className,
      )}
    >
      {leftIcon && (
        <Button
          size="icon_md"
          onClick={onLeftClick}
          icon={leftIcon}
          theme="text"
        ></Button>
      )}
      <h1 className="heading-2 text-center">{title}</h1>
      {rightIcon && (
        <Button
          size="icon_md"
          onClick={onRightClick}
          icon={rightIcon}
          theme="text"
        ></Button>
      )}
    </header>
  );
};

export default MobileHeader;
