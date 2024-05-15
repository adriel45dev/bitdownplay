import torrentStream from "torrent-stream";

export default async function handler(req, res) {
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
      const contentLength = file.length;

      res.setHeader("Content-Length", contentLength.toString());
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.name}"`
      );

      stream.on("data", (chunk) => {
        res.write(chunk);
      });

      stream.on("end", () => {
        res.end();
      });

      stream.on("error", (err) => {
        console.error("Error streaming file:", err);
        res.status(500).json({ message: "Internal Server Error" });
      });
    });

    engine.on("error", (err) => {
      console.error("Error loading torrent:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
