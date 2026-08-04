import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(fileString: string): Promise<string> {
  try {
    // If user provided valid Cloudinary credentials, attempt upload
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
      process.env.CLOUDINARY_API_KEY !== '1234567890'
    ) {
      const result = await cloudinary.uploader.upload(fileString, {
        folder: 'gautam_trading_products',
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
