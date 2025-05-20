export function CoinOff({ className, ...props }: React.ComponentProps<"svg">) {
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
      <circle cx="12" cy="12" r="8.5" stroke="#6B6B6B" />
      <path
        d="M7.5 9L9.75 16.2L12 9L14.25 16.2L16.5 9"
        stroke="#6B6B6B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.55H7.05005H16.95"
        stroke="#6B6B6B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CoinOn({ className, ...props }: React.ComponentProps<"svg">) {
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
      <circle cx="12" cy="12" r="9" fill="#FBC42E" />
      <path
        d="M7.5 9L9.75 16.2L12 9L14.25 16.2L16.5 9"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.55H7.05005H16.95"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
