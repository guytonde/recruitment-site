import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { pool } from '../database.js';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later'
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({error: 'Email, password, and name required'});
  }

  if (password.length < 12) {
    return res.status(400).json({error: 'Password must be at least 12 characters'});
  }

  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
    return res.status(400).json({error: 'Password must contain uppercase, number, and special character'});
  }

  try {
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({error: 'User already exists'});
    }

    const passwordHash = bcrypt.hashSync(password, 12);

    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name]
    );

    const user = result.rows[0];

    await pool.query(
      'INSERT INTO user_roles (user_id, role) VALUES ($1, $2)',
      [user.id, 'applicant']
    );

    const accessToken = generateAccessToken(user.id, 'applicant');
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Registration failed'});
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({error: 'Email and password required'});
  }

  try {
    const result = await pool.query(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({error: 'Invalid credentials lmao'});
    }

    const user = result.rows[0];

    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({error: 'Invalid credentials lmao'});
    }

    const roleResult = await pool.query(
      'SELECT role FROM user_roles WHERE user_id = $1 LIMIT 1',
      [user.id]
    );

    const role = roleResult.rows[0]?.role || 'applicant';

    const accessToken = generateAccessToken(user.id, role);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Login failed womp womp'});
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({error: 'Refresh token required'});
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.userId, decoded.role);
    res.json({accessToken});
  } catch (err) {
    return res.status(401).json({error: 'Invalid refresh token'});
  }
});

export default router;
