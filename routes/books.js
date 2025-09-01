const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.get('/:id/availability', auth, bookController.checkBookAvailability);

router.post('/', auth, isAdmin, bookController.createBook);
router.post('/:id/pdf', auth, isAdmin, ...upload, bookController.uploadBookPdf);
router.delete('/:id/pdf', auth, isAdmin, bookController.removeBookPdf);
router.get('/:id/pdf', auth, bookController.downloadBookPdf);
router.put('/:id/status', auth, isAdmin, bookController.updateBookStatus);

module.exports = router;
