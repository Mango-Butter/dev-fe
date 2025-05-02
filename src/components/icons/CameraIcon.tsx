export function CameraOff({
  className,
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
      <path
        d="M3 18V9.38333C3 8.83105 3.44772 8.38333 4 8.38333H6.5C7.05228 8.38333 7.5 7.93562 7.5 7.38333V7C7.5 6.44772 7.94772 6 8.5 6H12H15.5C16.0523 6 16.5 6.44772 16.5 7V7.38333C16.5 7.93562 16.9477 8.38333 17.5 8.38333H20C20.5523 8.38333 21 8.83105 21 9.38333V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"
        stroke="#6B6B6B"
      />
      <circle cx="12" cy="13" r="3.5" stroke="#6B6B6B" />
    </svg>
  );
}

export function CameraOn({ className, ...props }: React.ComponentProps<"svg">) {
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
      <path
        d="M3 18V9.38333C3 8.83105 3.44772 8.38333 4 8.38333H6.5C7.05228 8.38333 7.5 7.93562 7.5 7.38333V7C7.5 6.44772 7.94772 6 8.5 6H12H15.5C16.0523 6 16.5 6.44772 16.5 7V7.38333C16.5 7.93562 16.9477 8.38333 17.5 8.38333H20C20.5523 8.38333 21 8.83105 21 9.38333V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z"
        fill="#FBC42E"
        stroke="#FBC42E"
      />
      <circle cx="12" cy="13" r="3.5" fill="white" stroke="white" />
      <circle cx="12" cy="13" r="1.5" fill="#FBC42E" stroke="#FBC42E" />
    </svg>
  );
}
