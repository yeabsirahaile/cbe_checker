const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied." });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY"); // Replace "SECRET_KEY" with your actual secret
    req.user = decoded; // Add decoded token data to the request object
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid token." });
  }
};

module.exports = verifyToken;
