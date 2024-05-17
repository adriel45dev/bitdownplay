import React from "react";
import { DownIcon } from "./icons";

export default function Brand() {
  return (
    <h1 className="text-white text-4xl sm:text-6xl font-extrabold flex">
      <span className="text-violet-400">Bit</span>
      <DownIcon className="w-10 h-10 sm:w-16 sm:h-16 rotate-180" />
      <span className="text-violet-400">Down</span>
    </h1>
  );
}
