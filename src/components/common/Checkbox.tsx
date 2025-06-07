import { cn } from "../../libs";
import { CheckboxFilled, CheckboxOn } from "../icons/CheckboxIcon.tsx";
import Spinner from "../common/Spinner.tsx";

interface CheckboxProps extends React.ComponentProps<"div"> {
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  description?: string;
  required?: boolean;
  optional?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  className,
  checked = false,
  onChange,
  label,
  required,
  optional,
  icon,
  description,
  isLoading = false, // 기본값 false
  ...props
}) => {
  return (
    <div {...props} className={cn("flex flex-col self-stretch p-4", className)}>
      <div className="flex self-stretch">
        <label className="body-1 max-md:body-2 flex w-full cursor-pointer items-center gap-2 self-stretch">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />

          {isLoading ? (
            <Spinner className="h-6 w-6" />
          ) : checked ? (
            <CheckboxFilled className="h-6 w-6" />
          ) : (
            <CheckboxOn className="h-6 w-6" />
          )}

          <span
            className={checked ? "text-grayscale-900" : "text-grayscale-500"}
          >
            {label}
          </span>

          {required && (
            <span className="body-1 max-md:body-2 text-warning">(필수)</span>
          )}
          {optional && (
            <span className="body-1 max-md:body-2 text-grayscale-500">
              (선택)
            </span>
          )}
        </label>
        {icon}
      </div>

      {description && (
        <span className="flex self-stretch body-3 text-gray-400 ml-6 px-2">
          {description}
        </span>
      )}
    </div>
  );
};

export default Checkbox;
