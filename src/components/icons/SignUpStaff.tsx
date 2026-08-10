import React from "react";
import signUpStaffImg from "../../assets/landing/SignUpStaff.webp";

type SignUpStaffProps = React.ComponentProps<"svg"> & {
  width?: number | string;
  height?: number | string;
};

export default function SignUpStaff({
  width = 300,
  height = 300,
  ...restProps
}: SignUpStaffProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...restProps}
    >
      <image
        href={signUpStaffImg}
        width="300"
        height="300"
      />
    </svg>
  );
}
