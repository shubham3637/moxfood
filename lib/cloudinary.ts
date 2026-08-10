import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '@/lib/constants';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(fileString: string): Promise<string> {
  try {
    if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
      const result = await cloudinary.uploader.upload(fileString, {
        folder: 'moxfood_products',
      });
      return result.secure_url;
    }
  } catch (error) {
    console.warn('Cloudinary upload skipped or failed, using fallback string/data URL:', error);
  }

  // Return the base64/image string as fallback if Cloudinary is not configured or throws
  return fileString;
}

export default cloudinary;
