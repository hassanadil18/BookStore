const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File is too large. Maximum size allowed is 50MB'
            });
        }
        return res.status(400).json({
            error: `Upload error: ${err.message}`
        });
    }
    
    // Handle other errors
    console.error(err);
    res.status(500).json({
        error: 'An unexpected error occurred'
    });
};

module.exports = errorHandler;
