export const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://gautamtrading:gautamtrading@cluster0.jwprrpo.mongodb.net/gautamtrading?retryWrites=true&w=majority';

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'wvorocin';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '294823518775962';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'ELUDg-pzQVQimjKtUvoHKO5Gt6w';

// Razorpay API Credentials (Supports environment variables or fallback keys)
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TOiv0CfziwgV0i';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'DaBwCpS04m4bN4XChVsNLr5Q';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://moxfood.com';
