const MAX_DIM = 1920;
const QUALITY = 0.82;

export async function compressImage(file: File): Promise<Blob> {
  const img = await fileToImage(file);
  const { width, height } = fitDimensions(img.width, img.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob(
      (b) => resolve(b!),
      "image/webp",
      QUALITY
    );
  });
}

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

function fitDimensions(w: number, h: number) {
  if (w <= MAX_DIM && h <= MAX_DIM) return { width: w, height: h };
  const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
}
