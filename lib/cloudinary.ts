import { v2 as cloudinary } from 'cloudinary';

function configure() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Missing Cloudinary credentials. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.'
    );
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

/**
 * Uploads a buffer to Cloudinary and returns the public_id and secure_url.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  publicId: string,
  folder: string
): Promise<{ publicId: string; secureUrl: string }> {
  configure();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: `wallpaper-hub/${folder}`,
        resource_type: 'image',
        overwrite: false,
        // Store the already-resized JPEG as-is (no further Cloudinary transforms)
        format: 'jpg',
        quality: 'auto',
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'));
        resolve({ publicId: result.public_id, secureUrl: result.secure_url });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Returns the public delivery URL for a Cloudinary asset.
 */
export function getPublicUrl(publicId: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error('Missing CLOUDINARY_CLOUD_NAME');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

/**
 * Fetches a Cloudinary image and returns it as a Buffer (for download streaming).
 */
export async function downloadFromCloudinary(publicId: string): Promise<Buffer> {
  configure();

  const url = cloudinary.url(publicId, {
    resource_type: 'image',
    type: 'upload',
    format: 'jpg',
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Cloudinary fetch failed: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
