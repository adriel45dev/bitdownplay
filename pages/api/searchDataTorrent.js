import torrentStream from "torrent-stream";

export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { torrentHash } = req.query;

  if (!torrentHash) {
    res.status(400).json({ message: "Torrent hash is required" });
    return;
  }

  try {
    const engine = torrentStream(torrentHash);

    engine.on("ready", () => {
      const torrentInfo = {
        infoHash: engine.infoHash,
        name: engine.torrent.name,
        files: engine.files.map((file) => ({
          name: file.name,
          length: file.length,
          lengthInKB: Math.floor(file.length / 1024),
          downloadLink: `/api/download2?torrentHash=${torrentHash}&filePath=${encodeURIComponent(
            file.path
          )}`,
          path: file.path,
        })),
        peers: engine.swarm.numPeers,
        seeders: engine.swarm.numSeedersseeders,
      };

      res.status(200).json(torrentInfo);
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
