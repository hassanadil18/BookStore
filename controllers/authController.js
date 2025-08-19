const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const otpStore = {};
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role: role || 'user' });
        return res.json({ message: 'Registered', user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        return res.status(500).json({ message: 'Signup error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email/password' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ message: 'Login successful', token });
    } catch (err) {
        return res.status(500).json({ message: 'Login error', error: err.message });
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const {email}=req.body;
        if (!email) {
            return res.status(400).json({ message: 'Provide email' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email not registered' });
        }
        const otp = '1234';
        const expires = Date.now() + 1000 * 60 * 10;
        otpStore[email] = { otp, expires };
        console.log(`Your OTP is ${otp}. It is valid for 10 minutes.`);
        return res.json({ message: 'OTP sent' });

    } catch (err) {
        return res.status(500).json({ message: 'Forgot password error', error: err.message });
    }
};


exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNew } = req.body;
        if (!oldPassword || !newPassword || !confirmNew) {
            return res.status(400).json({ message: 'Provide old, new and confirm passwords' });
        }
        if (newPassword !== confirmNew) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        const user = req.user;
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Old password incorrect' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();
        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Update password error', error: err.message });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmNew } = req.body;
        if (!email || !otp || !newPassword || !confirmNew) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        if (newPassword !== confirmNew) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        const record = otpStore[email];
        if (!record) return res.status(400).json({ message: 'No OTP requested for this email' });
        if (record.expires < Date.now()) {
            delete otpStore[email];
            return res.status(400).json({ message: 'OTP expired' });
        }
        if (record.otp !== otp.toString()) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        delete otpStore[email];
        return res.json({ message: 'Password has been reset' });
    } catch (err) {
        return res.status(500).json({ message: 'Reset password error', error: err.message });
    }
};
