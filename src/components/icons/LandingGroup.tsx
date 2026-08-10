import landingGroupImg1 from "../../assets/landing/LandingGroup-1.webp";
import landingGroupImg2 from "../../assets/landing/LandingGroup-2.webp";
import landingGroupImg3 from "../../assets/landing/LandingGroup-3.webp";

export default function LandingGroup({}: React.ComponentProps<"svg">) {
  return (
    <svg
      width="344"
      height="304"
      viewBox="0 0 344 304"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect
        opacity="0.6"
        x="216.021"
        y="17.7422"
        width="127.96"
        height="269"
        fill="url(#pattern0_1378_13995)"
      />
      <rect
        opacity="0.6"
        x="0.0205078"
        y="17.7422"
        width="127.939"
        height="269"
        fill="url(#pattern1_1378_13995)"
      />
      <rect
        x="100.021"
        y="0.742188"
        width="144"
        height="303"
        fill="url(#pattern2_1378_13995)"
      />
      <defs>
        <pattern
          id="pattern0_1378_13995"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_1378_13995"
            transform="scale(0.00222222 0.00105708)"
          />
        </pattern>
        <pattern
          id="pattern1_1378_13995"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image1_1378_13995"
            transform="scale(0.0025641 0.00121951)"
          />
        </pattern>
        <pattern
          id="pattern2_1378_13995"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image2_1378_13995"
            transform="matrix(0.00256606 0 0 0.00121951 -0.000381098 0)"
          />
        </pattern>
        <image
          id="image0_1378_13995"
          width="450"
          height="946"
          preserveAspectRatio="none"
          xlinkHref={landingGroupImg1}
        />
        <image
          id="image1_1378_13995"
          width="390"
          height="820"
          preserveAspectRatio="none"
          xlinkHref={landingGroupImg2}
        />
        <image
          id="image2_1378_13995"
          width="390"
          height="820"
          preserveAspectRatio="none"
          xlinkHref={landingGroupImg3}
        />
      </defs>
    </svg>
  );
}
