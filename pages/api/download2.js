import torrentStream from "torrent-stream";
import path from "path";

const MAX_STREAM_DURATION = 60 * 1000; // 1 minuto
const CHUNK_SIZE = 1 * 1024 * 1024; // 1 MB

export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { torrentHash, filePath } = req.query;

  if (!torrentHash || !filePath) {
    res
      .status(400)
      .json({ message: "Torrent hash and file path are required" });
    return;
  }

  try {
    const engine = torrentStream(torrentHash);

    engine.on("ready", () => {
      const fileIndex = engine.files.findIndex(
        (f) => f.path === decodeURIComponent(filePath)
      );

      if (fileIndex === -1) {
        res.status(404).json({ message: "File not found" });
        return;
      }

      const file = engine.files[fileIndex];
      let start = 0;

      const streamFile = () => {
        const end = Math.min(start + CHUNK_SIZE, file.length - 1);
        const stream = file.createReadStream({ start, end });

        let timeout = setTimeout(() => {
          stream.destroy();
          res.status(504).json({ message: "Request timed out" });
        }, MAX_STREAM_DURATION);

        stream.on("data", (chunk) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            stream.destroy();
            res.status(504).json({ message: "Request timed out" });
          }, MAX_STREAM_DURATION);
          res.write(chunk);
        });

        stream.on("end", () => {
          clearTimeout(timeout);
          if (end < file.length - 1) {
            start = end + 1;
            streamFile();
          } else {
            res.end();
          }
        });

        stream.on("error", (err) => {
          console.error("Error streaming file:", err);
          clearTimeout(timeout);
          res.status(500).json({ message: "Internal Server Error" });
        });
      };

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(file.name)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      streamFile();
    });
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
