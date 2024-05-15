"use client";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { UploadIcon } from "../icons";
import { sha1 } from "js-sha1";

const readFileContents = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};

const calculateTorrentHash = (fileContents: ArrayBuffer): string => {
  const buffer = Buffer.from(fileContents);
  const pieces = [];

  // Divide o arquivo em pedaços de 20 bytes
  for (let i = 0; i < buffer.length; i += 20) {
    pieces.push(buffer.slice(i, i + 20));
  }

  // Concatena os pedaços
  const concatenatedPieces = Buffer.concat(pieces);

  // Calcula o hash SHA-1 dos pedaços concatenados
  const hash = sha1(concatenatedPieces);

  return hash.toUpperCase();
};

type InputFileProps = {
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  hash: string;
  setHash: Dispatch<SetStateAction<string>>;
};

const InputFile: React.FC<InputFileProps> = ({
  selectedFile,
  setSelectedFile,
  hash,
  setHash,
}) => {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [hash, setHash] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      setSelectedFile(null);
      setHash("");
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    readFileContents(file)
      .then((fileContents) => calculateTorrentHash(fileContents))
      .then((calculatedHash) => setHash(calculatedHash))
      .catch((error) =>
        console.error("Error reading file or calculating hash:", error)
      );
  };

  return (
    <div className="flex items-center justify-center w-full mt-6">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2  border-dashed rounded-lg cursor-pointer hover:bg-bray-800 bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-8 h-8 text-violet-400" />
          <p className="mb-2 text-sm  text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs  text-gray-400">.torrent</p>
        </div>
        <input
          type="file"
          accept=".torrent"
          onChange={handleFileChange}
          id="dropzone-file"
          className="hidden"
        />
        {selectedFile && (
          <p className="text-gray-400">Selected file: {selectedFile.name}</p>
        )}
        {hash && <p className="text-gray-400">Hash: {hash}</p>}
      </label>
    </div>
  );
};

export default InputFile;
