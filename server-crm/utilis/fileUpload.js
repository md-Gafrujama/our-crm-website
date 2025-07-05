// import fs from 'fs';
// import multer from 'multer';
// import path from 'path';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import cloudinary from 'cloudinary';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, '../../uploads/profile');

//     fs.mkdirSync(uploadDir, { recursive: true });

//     cb(null, uploadDir); 
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024 // 2MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   }
// });

// try {
//   await cloudinary.v2.api.ping();
//   console.log('Cloudinary connected successfully!');
// } catch (error) {
//   console.error('Cloudinary connection failed:', error.message);
//   throw error; 
// }

// const uploadToCloudinary = async (req, res, next) => {
//   if (!req.file) {
//     console.log('No file to upload to Cloudinary');
//     return next();
//   }

//   try {
//     console.log('Uploading to Cloudinary...');
//     const result = await cloudinary.v2.uploader.upload(req.file.path, {
//       folder: 'user-profile-photos'
//     });
    
//     fs.unlinkSync(req.file.path); // Clean up local file
//     // console.log('File uploaded to Cloudinary:', result.secure_url);
    
//     req.cloudinaryUrl = result.secure_url;
//     next();
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     if (req.file?.path) {
//       fs.unlinkSync(req.file.path).catch(console.error);
//     }
//     return res.status(500).json({ 
//       message: 'Error uploading file to Cloudinary',
//       error: error.message 
//     });
//   }
// };

// export { upload, uploadToCloudinary };




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

// Validate environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to safely clean up files
const safeFileCleanup = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up temporary file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Failed to clean up file ${filePath}:`, error.message);
  }
};

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/profile');
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch (error) {
  console.error('Failed to create upload directory:', error.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(sanitizedOriginalName));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1 // Limit to 1 file
  },
  fileFilter: (req, file, cb) => {
    // More specific image type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP image files are allowed!'), false);
    }
  }
});

// Test Cloudinary connection with proper error handling
const testCloudinaryConnection = async () => {
  try {
    await cloudinary.v2.api.ping();
    console.log('Cloudinary connected successfully!');
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:', error.message);
    return false;
  }
};

// Initialize connection test
testCloudinaryConnection().catch(console.error);

const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    console.log('No file to upload to Cloudinary');
    return next();
  }

  const filePath = req.file.path;
  
  try {
    console.log('Uploading to Cloudinary...');
    
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'user-profile-photos',
      resource_type: 'auto',
      quality: 'auto:good', // Optimize image quality
      fetch_format: 'auto', // Auto-select best format
      transformation: [
        {
          width: 800,
          height: 800,
          crop: 'limit' // Limit dimensions while maintaining aspect ratio
        }
      ]
    });

    // Clean up local file after successful upload
    safeFileCleanup(filePath);
    
    console.log('File uploaded to Cloudinary:', result.secure_url);
    req.cloudinaryUrl = result.secure_url;
    req.cloudinaryPublicId = result.public_id; // Store public_id for future deletion
    
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Clean up local file on error
    safeFileCleanup(filePath);
    
    return res.status(500).json({
      success: false,
      message: 'Error uploading file to Cloudinary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Upload failed'
    });
  }
};

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 2MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only 1 file is allowed.'
      });
    }
  }
  
  if (error.message.includes('Only')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  return res.status(500).json({
    success: false,
    message: 'File upload error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Upload failed'
  });
};

// Cleanup middleware for failed requests
const cleanupOnError = (req, res, next) => {
  res.on('finish', () => {
    if (req.file && res.statusCode >= 400) {
      safeFileCleanup(req.file.path);
    }
  });
  next();
};

export { 
  upload, 
  uploadToCloudinary, 
  handleMulterError, 
  cleanupOnError,
  testCloudinaryConnection 
};