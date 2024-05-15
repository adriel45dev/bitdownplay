import * as React from "react";
import { SVGProps } from "react";
const LoadingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
      <path
        stroke="#363853"
        d="M17.657 12H21M3 12h3.343M12 6.343V3m0 18v-3.343"
      />
      <path
        stroke="#7C3AED"
        d="m16 8 2.364-2.364M5.636 18.364 8 16m0-8L5.636 5.636m12.728 12.728L16 16"
      />
    </g>
  </svg>
);
export default LoadingIcon;
