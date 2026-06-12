/**
 * Admin authorization middleware
 * Must be used AFTER authMiddleware (req.user must exist)
 * Checks if the authenticated user has admin role
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required. Forbidden.' });
  }

  next();
};

module.exports = adminMiddleware;
