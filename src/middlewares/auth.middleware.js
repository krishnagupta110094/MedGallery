const jwt = require("jsonwebtoken");

const auth = (requiredRole) => {
  return (req, res, next) => {
    try {
      // 🍪 cookie se token lena
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No token",
        });
      }

      // 🔐 verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 👤 user attach kar
      req.user = decoded;
      req.token = token;

      // 🎯 role check (agar requiredRole diya hai)
      if (requiredRole && requiredRole.includes(req.user.role) === false) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - Access denied",
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  };
};

module.exports = auth;
