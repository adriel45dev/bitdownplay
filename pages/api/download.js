import torrentStream from "torrent-stream";
import path from "path";

const MAX_STREAM_DURATION = 60 * 1000; // 1 minuto

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
      const stream = file.createReadStream();

      let timeout = setTimeout(() => {
        stream.destroy();
        res.status(504).json({ message: "Request timed out" });
      }, MAX_STREAM_DURATION);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(file.name)}"`
      );

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
        res.end();
      });

      stream.on("error", (err) => {
        console.error("Error streaming file:", err);
        clearTimeout(timeout);
        res.status(500).json({ message: "Internal Server Error" });
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
