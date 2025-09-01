const multer = require('multer');
const path = require('path');
const { saveUploadToFile } = require('../utils/streamUtils');

// Configure multer to handle files in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Middleware to handle file upload using streams
const handleStreamUpload = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const filename = Date.now() + path.extname(req.file.originalname);
    const filePath = path.join('uploads', 'pdfs', filename);
    const dbPath = path.join('uploads/pdfs', filename).replace(/\\/g, '/');

    // Convert buffer to stream and save
    const fileStream = require('stream').Readable.from(req.file.buffer);
    const success = await saveUploadToFile(fileStream, filePath);

    if (success) {
        req.file.path = dbPath;  // Use the URL-friendly path
        next();
    } else {
        res.status(500).json({ error: 'Failed to save file' });
    }
};

// Export middleware chain
module.exports = [upload.single('pdf'), handleStreamUpload];
