const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Get JWT from HttpOnly cookie (e.g. req.cookies.token)
  const token = (req.cookies && req.cookies.token) || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token, please login" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ message: "Forbidden: Incorrect role" });
  next();
};

module.exports = { authenticate, requireRole };
