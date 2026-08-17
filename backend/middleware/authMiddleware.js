const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRET_KEY;

// Protected routes
const authMiddleware = (req, res, next) => {
  const token =
    req.cookies.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// Public routes
const optionalAuth = (req, res, next) => {
  const token =
    req.cookies.token ||
    req.headers.authorization?.split(" ")[1];

  req.userRole = "guest";

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
    } catch (err) {}
  }

  next();
};

module.exports = {
  authMiddleware,
  optionalAuth,
};