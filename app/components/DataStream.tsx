"use client";
import React, { useEffect, useState } from "react";
import { FILE_EXTENSIONS } from "../constants";

interface DataStreamProps {
  torrentHash: string;
  filePath: string;
  fileName: string;
}
export default function DataStream({
  torrentHash,
  filePath,
  fileName,
}: DataStreamProps) {
  const [isVideo, setIsVideo] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [isAudio, setIsAudio] = useState(false);

  const [SRC_MEDIA, setSRC_MEDIA] = useState("");

  useEffect(() => {
    setSRC_MEDIA(
      `/api/download2?torrentHash=${torrentHash}&filePath=${encodeURIComponent(
        filePath
      )}`
    );
    const PATH = filePath.split(".");
    const EXTENSION = PATH[PATH.length - 1];

    setIsVideo(FILE_EXTENSIONS.VIDEO.includes(EXTENSION));
    setIsImage(FILE_EXTENSIONS.IMAGE.includes(EXTENSION));
    setIsAudio(FILE_EXTENSIONS.AUDIO.includes(EXTENSION));
    // setIsText(FILE_EXTENSIONS.TEXT.includes(EXTENSION));
  }, [filePath]);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="text-white p-4">{fileName}</div>
      {isVideo && <video src={SRC_MEDIA} controls autoPlay />}
      {isImage && (
        <img
          src={SRC_MEDIA}
          alt={fileName}
          onError={() => setSRC_MEDIA("/img/broken-image.svg")}
        />
      )}
      {isAudio && <audio controls src={SRC_MEDIA} autoPlay></audio>}
    </div>
  );
}
