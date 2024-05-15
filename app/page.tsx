"use client";
import { useEffect, useState } from "react";
import InputFile from "./components/(input)/InputFile";
import InputMagnet from "./components/(input)/InputMagnet";
import Brand from "./components/Brand";
import {
  DownloadIcon2,
  FileIcon,
  FileIcon2,
  ImageIcon,
  MagnetIcon,
  MusicIcon,
  PlayIcon,
  UnknownFileIcon,
} from "./components/icons";
import Link from "next/link";
import { FILE_EXTENSIONS } from "./constants";
import { openTextFile } from "@/utils/openTextFile";
import Alert from "./components/Alert";
import DataStream from "./components/DataStream";
import { log } from "console";

const fetchSearchTorrent = async (hash: string) => {
  try {
    const response = await fetch(`/api/searchDataTorrent?torrentHash=${hash}`);

    if (response.ok) {
      return await response.json();
    } else {
      console.error("File not found!");
    }
  } catch (error) {
    console.error("File not found!", error);
  }
};

// dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c

type DataType = {
  infoHash: string;
  name: string;
  files: {
    name: string;
    length: number;
    lengthInKB: number;
    downloadLink: string;
    path: string;
  }[];
  seeders?: number;
  leechers?: number;
};

export default function Home() {
  const [isMagnet, setIsMagnet] = useState(true);
  const [input, setInput] = useState<string>("");
  // const [inputFile, setInputFile] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hash, setHash] = useState("");
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(-1); // -1 0 1

  useEffect(() => {
    setDataLoaded(-1);
  }, [input, selectedFile]);

  const [dataStream, setDataStream] = useState<{
    torrentHash: string;
    filePath: string;
    fileName: string;
  } | null>(null);

  const handleSwitchInputType = () => {
    setIsMagnet((prev) => !prev);
  };

  const handleSearch = async () => {
    setDataLoaded(-1);
    if (!input && isMagnet) return;
    if (!selectedFile && !isMagnet) return;
    const activeHash = isMagnet ? input : hash;
    console.log(activeHash);

    setLoading(true);
    const info = await fetchSearchTorrent(activeHash);
    !info ? setDataLoaded(0) : setDataLoaded(1);
    setLoading(false);
    setData(info);
  };

  const maskFileSize = (size: number) => {
    if (size < 1000) return `${size.toFixed(2)} Kb`;
    if (size < 1000000) return `${(size / 1000).toFixed(2)} Mb`;
    return `${(size / 1000000).toFixed(2)} Gb`;
  };

  const FileTypeAction = ({
    fileName,
    filePath,
    infoHash,
  }: {
    fileName: string;
    filePath: string;
    infoHash: string;
  }) => {
    const path = filePath.split(".");
    const format = path[path.length - 1];
    const isVideo = FILE_EXTENSIONS.VIDEO.includes(format);
    const isImage = FILE_EXTENSIONS.IMAGE.includes(format);
    const isAudio = FILE_EXTENSIONS.AUDIO.includes(format);
    const isText = FILE_EXTENSIONS.TEXT.includes(format);
    const isAnyFile = isVideo || isImage || isAudio || isText;

    const handleFilePreview = () => {
      setDataStream({
        torrentHash: infoHash,
        filePath: filePath,
        fileName: fileName,
      });
    };

    const handleOpenFileText = async () => {
      await openTextFile(infoHash, filePath);
    };

    return isAnyFile ? (
      <Link
        href={"#preview"}
        onClick={() => {
          isText
            ? (() => {
                handleOpenFileText();
                handleFilePreview();
              })()
            : handleFilePreview();
        }}
      >
        <>
          {isVideo && (
            <PlayIcon
              className="w-6 h-6 hover:text-green-400 hover:scale-110"
              aria-label="Video"
            />
          )}
          {isText && (
            <FileIcon2
              className="w-6 h-6 hover:text-green-400 hover:scale-110"
              aria-label="Text File"
            />
          )}

          {isImage && (
            <ImageIcon
              className="w-6 h-6 hover:text-green-400 hover:scale-110"
              aria-label="Image"
            />
          )}

          {isAudio && (
            <MusicIcon
              className="w-6 h-6 hover:text-green-400 hover:scale-110"
              aria-label="Audio"
            />
          )}
        </>
      </Link>
    ) : (
      <div>
        <UnknownFileIcon className="w-6 h-6 hover:text-green-400 hover:scale-110" />
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-16 p-8 sm:p-24">
      <Brand />

      <section className="flex flex-col w-full justify-center items-center gap-2 mt-6">
        <div className="w-full">
          {dataLoaded == 0 && (
            <Alert
              message="Failed to load the torrent"
              setDataLoaded={setDataLoaded}
            />
          )}
        </div>
        <div className="flex justify-center items-center w-full gap-1 relative">
          {isMagnet ? (
            <InputMagnet input={input} setInput={setInput} />
          ) : (
            <InputFile
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              hash={hash}
              setHash={setHash}
            />
          )}
          <button
            className="bg-violet-600 p-2 rounded-full hover:bg-gray-200 group absolute top-0 right-0 "
            onClick={handleSwitchInputType}
          >
            {isMagnet ? (
              <FileIcon className="text-white w-6 h-6 group-hover:text-violet-500 group-hover:scale-125" />
            ) : (
              <MagnetIcon className="text-white w-6 h-6 group-hover:text-violet-500 group-hover:scale-125" />
            )}
          </button>
        </div>

        <div className="flex justify-center items-center w-full">
          <button
            className="rounded-full px-1.5 py-1 bg-violet-600 text-white w-full"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Retrieving metadata..." : "Go"}
          </button>
        </div>
      </section>
      {data && (
        <section className="text-white mt-6 min-h-screen w-full flex flex-col min-w-[300px]">
          <div className="flex flex-col justify-center-center border border-violet-500 py-4 px-2 rounded-lg">
            <div className="text-md sm:text-lg text-center font-bold">
              {data.name}
            </div>

            <ul className="text-white mt-2 flex w-full items-center flex-col gap-2">
              {data &&
                data.files.map((file, id) => {
                  return (
                    <li
                      key={id}
                      className=" flex w-full gap-2 hover:bg-gray-950 odd:bg-gray-600 even:bg-gray-800 px-3 py-2  rounded-full text-sm text-violet-200 justify-between"
                    >
                      <div className="flex w-full items-center overflow-hidden px-2 group">
                        {/* MOBILE */}
                        <p className="text-wrap break-words flex sm:hidden group-hover:hidden">
                          <span className="">
                            {file.name.length > 8
                              ? `${file.name.slice(0, 8)}...`
                              : file.name}
                          </span>
                        </p>

                        <p className=" hidden min-w-max sm:hidden group-hover:flex sm:group-hover:hidden animate-marquee">
                          <span className=" ">{file.name}</span>
                        </p>

                        <p className="text-wrap break-words hidden sm:flex">
                          {file.path}
                        </p>
                      </div>
                      <div className="flex max-w-max justify-center items-center p-2 gap-2">
                        <div className="border-r-2 border-violet-400 rounded-lg shadow-lg px-2 min-w-max text-violet-400">
                          {maskFileSize(file.lengthInKB)}
                        </div>
                        <FileTypeAction
                          fileName={file.name}
                          filePath={file.path}
                          infoHash={data.infoHash}
                        />

                        <Link href={file.downloadLink}>
                          <DownloadIcon2 className="w-6 h-6 hover:text-green-400 hover:scale-110" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
            </ul>
            <div className="flex justify-center items-center w-full mt-2">
              <button className="rounded-full px-1.5 py-1 bg-violet-600  text-white w-full">
                Download
              </button>
            </div>

            <div className="w-full mt-2" id="preview">
              {dataStream && (
                <DataStream
                  torrentHash={dataStream.torrentHash}
                  filePath={dataStream.filePath}
                  fileName={dataStream.fileName}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
