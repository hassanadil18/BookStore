const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
router.get('/profile', auth, userController.getProfile);
router.put('/profile/change-role', auth, isAdmin, userController.changeUserRole);
router.put('/profile/change-details', auth, isAdmin, userController.changeUserDetails);

router.get('/profile/all', auth, isAdmin, userController.getAllUsers);
router.put('/profile', auth, userController.uploadMiddleware, userController.updateProfile);

module.exports = router;
