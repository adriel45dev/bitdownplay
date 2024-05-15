import React, { Dispatch, SetStateAction } from "react";
import { MagnetIcon } from "../icons";

type InputMagnetProps = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
};

export default function InputMagnet({ input, setInput }: InputMagnetProps) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInput(value);
  };
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
        <MagnetIcon className="w-6 h-6 text-violet-400" />
      </div>
      <input
        type="text"
        className=" w-full border text-sm rounded-full block  ps-10 p-2.5 pl-12  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-violet-500 focus:border-violet-500"
        placeholder="magnet"
        value={input}
        onChange={(e) => handleInput(e)}
      />
    </div>
  );
}
