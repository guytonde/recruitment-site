import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Missing or invalid authorization header'});
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({error: 'Invalid or expired token'});
  }
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({error: 'Admin access required'});
  }
  next();
}

export function generateAccessToken(userId, role) {
  return jwt.sign(
    {userId, role},
    process.env.JWT_SECRET,
    {expiresIn: '15m'}
  );
}

export function generateRefreshToken(userId) {
  return jwt.sign(
    {userId},
    process.env.JWT_REFRESH_SECRET,
    {expiresIn: '7d'}
  );
}
