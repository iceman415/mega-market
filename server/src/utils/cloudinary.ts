import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "mega-market"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(url: string): Promise<void> {
  // Extract public_id from Cloudinary URL
  // Format: https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
  const match = url.match(/\/v\d+\/(.+?)\.\w+$/);
  if (!match) throw new Error("Invalid Cloudinary URL");
  const publicId = match[1];

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

export async function deleteMultipleFromCloudinary(urls: string[]): Promise<void> {
  await Promise.allSettled(urls.map((url) => deleteFromCloudinary(url)));
}
