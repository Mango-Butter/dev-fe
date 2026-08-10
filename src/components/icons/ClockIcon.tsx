import clockIconImg from "../../assets/landing/ClockIcon.webp";

export default function ClockIcon({}: React.ComponentProps<"svg">) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="36" height="36" fill="url(#pattern0_1375_12651)" />
      <defs>
        <pattern
          id="pattern0_1375_12651"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1375_12651" transform="scale(0.00195312)" />
        </pattern>
        <image
          id="image0_1375_12651"
          width="512"
          height="512"
          preserveAspectRatio="none"
          xlinkHref={clockIconImg}
        />
      </defs>
    </svg>
  );
}
