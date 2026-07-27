import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'aurafinance_dev_secret_change_in_production';

/**
 * Middleware: Verify JWT token from Authorization header.
 * Sets req.userId on success.
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Not authorized. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token invalid or expired. Please log in again.' });
  }
};
