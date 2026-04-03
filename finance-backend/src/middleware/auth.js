import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next(); // move to next middleware or controller
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default auth;