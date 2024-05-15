// pages/api/stream/[torrentHash]/[filePath].js
import torrentStream from "torrent-stream";
import express from "express";

const app = express();

export default async function handler(req, res) {
  const { torrentHash, filePath } = req.query;

  // Caminho para salvar os arquivos temporários
  const tmpPath = `./tmp/${torrentHash}`;

  const engine = torrentStream(`magnet:?xt=urn:btih:${torrentHash}`, {
    tmp: tmpPath,
  });

  engine.on("ready", () => {
    engine.files.forEach((file) => {
      // Verifica se o arquivo é o que estamos procurando
      if (file.path === filePath) {
        const stream = file.createReadStream();
        stream.pipe(res);

        // Remover arquivos temporários após o término do streaming
        res.on("close", () => {
          engine.destroy();
        });
      }
    });
  });
}
