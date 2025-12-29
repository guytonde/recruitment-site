import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { pool } from '../database.js';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';
import { YEAR_LABELS } from '../lib/constants.js';

dotenv.config();

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {error: 'Too many login attempts, please try again later'}
});

const VALID_MAJORS = [
  'Electrical Engineering',
  'Computer Engineering',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Computer Science',
  'Physics',
  'Materials Science',
  'Undeclared',
  'Other'
];

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, eid, major, year } = req.body;

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({error: 'Email, password, first name, and last name required'});
  }

  if (email.length > 300 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({error: 'Invalid email address'});
  }

  if (password.length < 12) {
    return res.status(400).json({error: 'Password must be at least 12 characters'});
  }

  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
    return res.status(400).json({error: 'Password must contain uppercase, number, and special character'});
  }

  if (eid && eid.length > 10) {
    return res.status(400).json({error: 'EID must not exceed 10 characters'});
  }

  if (major && !VALID_MAJORS.includes(major)) {
    return res.status(400).json({error: 'Invalid major selected'});
  }

  if (year && (year < 1 || year > YEAR_LABELS.length)) {
    return res.status(400).json({error: 'Invalid year selected'});
  }

  try {
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({error: 'User already exists'});
    }

    // Check if EID already used
    if (eid) {
      const existingEid = await pool.query(
        'SELECT id FROM users WHERE eid = $1',
        [eid]
      );

      if (existingEid.rows.length > 0) {
        return res.status(409).json({error: 'EID already in use'});
      }
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 12);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, eid, major, year) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, first_name, last_name, eid, major, year`,
      [email, passwordHash, firstName, lastName, eid || null, major || null, year || null]
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
        firstName: user.first_name,
        lastName: user.last_name,
        eid: user.eid,
        major: user.major,
        year: user.year
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
      'SELECT id, email, first_name, last_name, eid, major, year, password_hash FROM users WHERE email = $1',
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
        firstName: user.first_name,
        lastName: user.last_name,
        eid: user.eid,
        major: user.major,
        year: user.year,
        role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Login failed'});
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
