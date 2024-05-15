import * as React from "react";
import { SVGProps } from "react";
const DownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={2}
      d="M5.239 14.812a7 7 0 0 0 13.523 0"
    />
    <path
      fill="currentColor"
      d="m12 4-.625-.78.625-.5.625.5L12 4Zm1 9a1 1 0 1 1-2 0h2ZM6.375 7.22l5-4 1.25 1.56-5 4-1.25-1.56Zm6.25-4 5 4-1.25 1.56-5-4 1.25-1.56ZM13 4v9h-2V4h2Z"
    />
  </svg>
);
export default DownIcon;
