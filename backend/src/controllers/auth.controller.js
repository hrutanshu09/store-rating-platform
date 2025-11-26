const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/password');
const {
  nameIsValid,
  addressIsValid,
  passwordIsValid,
  emailIsValid
} = require('../utils/validators');
require('dotenv').config();

// Normal user signup
const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (!nameIsValid(name) || !emailIsValid(email) ||
        !passwordIsValid(password) || !addressIsValid(address)) {
      return res.status(400).json({ message: 'Validation failed' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await hashPassword(password);

    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), hashed, address?.trim() || null, 'USER']
    );

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Login for all roles
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update password for logged-in user
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!passwordIsValid(newPassword)) {
      return res.status(400).json({ message: 'New password does not meet requirements' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const hashed = await hashPassword(newPassword);
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashed, req.user.id]
    );

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, updatePassword };
