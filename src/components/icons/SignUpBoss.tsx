import React from "react";
import signUpBossImg from "../../assets/landing/SignUpBoss.webp";

type SignUpBossProps = React.ComponentProps<"svg"> & {
  width?: number | string;
  height?: number | string;
};

export default function SignUpBoss({
  width = 300,
  height = 300,
  ...restProps
}: SignUpBossProps) {
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
        href={signUpBossImg}
        width="300"
        height="300"
      />
    </svg>
  );
}
