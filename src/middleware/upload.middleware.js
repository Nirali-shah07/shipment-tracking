import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from '../utils/apiError.js';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const uploadsDir = path.resolve('uploads/invoices');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `invoice-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new ApiError(400, `Invalid file type. Allowed types: PDF, JPEG, PNG`),
      false
    );
  }
  cb(null, true);
};

export const uploadMiddleware = multer({
  storage: localStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
}).single('invoice');

export const handleMulterError = (err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return next(new ApiError(400, 'File too large. Maximum allowed size is 5MB'));
  }
  next(err);
};
