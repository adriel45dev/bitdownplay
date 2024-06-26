import * as React from "react";
import { SVGProps } from "react";
const MusicIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m10.09 11.963 9.273-3.332L21 7.952v-.46c0-1.12 0-2.059-.088-2.807a6.727 6.727 0 0 0-.043-.31c-.085-.51-.234-.988-.523-1.386a2.242 2.242 0 0 0-.675-.617l-.01-.005c-.77-.461-1.638-.428-2.532-.224-.864.198-1.935.6-3.249 1.095l-2.284.859c-.616.231-1.138.427-1.547.63-.436.216-.811.471-1.092.851-.282.38-.399.79-.452 1.234-.05.418-.05.926-.05 1.525v4.265l1.636-.64Z"
      clipRule="evenodd"
    />
    <g fill="currentColor" opacity={0.5}>
      <path d="M8.455 16.13a3.825 3.825 0 0 0-1.91-.5C4.587 15.63 3 17.056 3 18.815 3 20.574 4.587 22 6.545 22c1.959 0 3.546-1.426 3.546-3.185v-6.852l-1.636.638v3.53ZM19.364 8.63v5.54a3.825 3.825 0 0 0-1.91-.5c-1.958 0-3.545 1.426-3.545 3.185 0 1.759 1.587 3.185 3.545 3.185 1.959 0 3.546-1.426 3.546-3.185V7.952l-1.636.679Z" />
    </g>
  </svg>
);
export default MusicIcon;
