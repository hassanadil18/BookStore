const { User } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${req.user.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('profilePic');

exports.getProfile = async (req, res) => {
  const user = req.user;
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'profilePic']
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.changeUserRole = async (req, res) => {
  const { userId, newRole } = req.body;
  if (!userId || !newRole) {
    return res.status(400).json({ message: 'User ID and new role are required' });
  }
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = newRole;
    await user.save();
    return res.json({ message: 'User role updated', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating user role', error: err.message });
  }
};

exports.changeUserDetails = async (req, res) => {
  const { userId, name, email } = req.body;
  if (!userId || !name || !email) {
    return res.status(400).json({ message: 'User ID, name, and email are required' });
  }
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = name;
    user.email = email;
    await user.save();
    return res.json({ message: 'User details updated', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating user details', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email } = req.body;

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ message: 'Email already used' });
    }

    if (req.file) {
      if (user.profilePic) {
        const prev = `./uploads/${user.profilePic}`;
        try { if (fs.existsSync(prev)) fs.unlinkSync(prev); } catch (e) {}
      }
      user.profilePic = req.file.filename;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    return res.json({ message: 'Profile updated', user: { id: user.id, name: user.name, email: user.email, profilePic: user.profilePic } });
  } catch (err) {
    return res.status(500).json({ message: 'Update profile error', error: err.message });
  }
};
