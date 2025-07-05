import fs from 'fs';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cloudinary from 'cloudinary';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profile');

    fs.mkdirSync(uploadDir, { recursive: true });

    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

try {
  await cloudinary.v2.api.ping();
  console.log('Cloudinary connected successfully!');
} catch (error) {
  console.error('Cloudinary connection failed:', error.message);
  throw error; 
}

const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    console.log('No file to upload to Cloudinary');
    return next();
  }

  try {
    console.log('Uploading to Cloudinary...');
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: 'user-profile-photos'
    });
    
    fs.unlinkSync(req.file.path); // Clean up local file
    // console.log('File uploaded to Cloudinary:', result.secure_url);
    
    req.cloudinaryUrl = result.secure_url;
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    if (req.file?.path) {
      fs.unlinkSync(req.file.path).catch(console.error);
    }
    return res.status(500).json({ 
      message: 'Error uploading file to Cloudinary',
      error: error.message 
    });
  }
};

export { upload, uploadToCloudinary };
