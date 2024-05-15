export const openTextFile = async (torrentHash: string, filePath: string) => {
  try {
    const response = await fetch(
      `/api/stream?torrentHash=${torrentHash}&filePath=${encodeURIComponent(
        filePath
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Could not get reader from response body");
    }

    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }
      chunks.push(value);
    }

    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";
    const blob = new Blob(chunks, { type: contentType });
    const url = window.URL.createObjectURL(blob);

    const text = await blob.text();

    // Cria um objeto Blob com o conteúdo do arquivo
    const textBlob = new Blob([text], { type: "text/plain" });

    // Cria um objeto URL a partir do Blob
    const textUrl = window.URL.createObjectURL(textBlob);

    // Abre uma nova aba com o conteúdo do arquivo
    window.open(textUrl);
  } catch (error) {
    console.error("Error fetching media:", error);
  }
};
