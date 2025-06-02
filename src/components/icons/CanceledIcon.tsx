export default function CanceledIcon({
  className,
  fill = "#2BC566",
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M16 8L8 16.5" stroke={fill} stroke-linecap="round" />
      <path d="M8 8L16 16.5" stroke={fill} stroke-linecap="round" />
      <circle cx="12" cy="12" r="8.5" stroke={fill} />
    </svg>
  );
}
