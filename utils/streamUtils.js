const fs = require('fs');
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');

// Convert buffer to stream
exports.bufferToStream = (buffer) => {
    return Readable.from(buffer);
};

// Stream file to response
exports.streamFileToResponse = async (filePath, res) => {
    try {
        const fileStream = fs.createReadStream(filePath);
        
        // Set headers for streaming
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        
        // Use pipeline for proper error handling and cleanup
        await pipeline(fileStream, res);
    } catch (error) {
        console.error('Streaming error:', error);
        // Only send error if headers haven't been sent
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error streaming file' });
        }
    }
};

// Save upload stream to file
exports.saveUploadToFile = async (fileStream, filePath) => {
    const writeStream = fs.createWriteStream(filePath);
    try {
        await pipeline(fileStream, writeStream);
        return true;
    } catch (error) {
        console.error('Upload error:', error);
        return false;
    }
};
