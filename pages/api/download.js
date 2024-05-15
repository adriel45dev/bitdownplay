import torrentStream from "torrent-stream";
import path from "path";

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
      const file = engine.files.find(
        (f) => f.path === decodeURIComponent(filePath)
      );

      if (!file) {
        res.status(404).json({ message: "File not found" });
        return;
      }

      const stream = file.createReadStream();
      stream.on("error", (err) => {
        console.error("Error streaming file:", err);
        res.status(500).json({ message: "Internal Server Error" });
      });

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(file.name)}"`
      );
      stream.pipe(res);
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
