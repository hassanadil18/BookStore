const { Book } = require('../models');
const fs = require('fs');
const path = require('path');
const getFullPdfUrl = (req, pdfUrl) => {
    if (!pdfUrl) return null;
    return `${req.protocol}://${req.get('host')}/${pdfUrl}`;
};


exports.createBook = async (req, res) => {
    try {
        const { title, author, status } = req.body;
        if (!title || !author) {
            return res.status(400).json({ message: 'Title and author are required' });
        }

        const pdfUrl = req.file ? req.file.path : null;

        const newBook = await Book.create({
            title,
            author,
            status: status || 'available',
            pdfUrl
        });

        res.status(201).json({
            message: 'Book created successfully',
            book: {
                ...newBook.toJSON(),
                pdfUrl: getFullPdfUrl(req, newBook.pdfUrl)
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.uploadBookPdf = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);

        if (!book) return res.status(404).json({ error: 'Book not found' });

        if (book.pdfUrl && fs.existsSync(book.pdfUrl)) {
            fs.unlinkSync(book.pdfUrl);
        }

        book.pdfUrl = req.file.path;
        await book.save();

        res.json({
            message: 'PDF uploaded successfully',
            book: {
                ...book.toJSON(),
                pdfUrl: getFullPdfUrl(req, book.pdfUrl)
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeBookPdf = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.pdfUrl && fs.existsSync(book.pdfUrl)) {
            fs.unlinkSync(book.pdfUrl);
            book.pdfUrl = null;
            await book.save();
        }

        res.json({ message: 'PDF removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.downloadBookPdf = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);
        if (!book || !book.pdfUrl || !fs.existsSync(book.pdfUrl)) {
            return res.status(404).json({ message: 'PDF not found' });
        }

        res.download(book.pdfUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBookStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const book = await Book.findByPk(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        book.status = status;
        await book.save();

        res.json({ message: 'Status updated successfully', book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        const updatedBooks = books.map(book => ({
            ...book.toJSON(),
            pdfUrl: getFullPdfUrl(req, book.pdfUrl)
        }));
        res.json(updatedBooks);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({
            ...book.toJSON(),
            pdfUrl: getFullPdfUrl(req, book.pdfUrl)
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkBookAvailability = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const isAvailable = book.status === 'available' && book.pdfUrl;
        res.json({
            available: isAvailable,
            message: isAvailable ? 'Book is available for download' : 'Book is currently not available',
            pdfUrl: isAvailable ? getFullPdfUrl(req, book.pdfUrl) : null
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
