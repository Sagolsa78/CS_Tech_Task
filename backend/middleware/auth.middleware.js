const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];


  if (!authHeader) return res.status(401).json({ message: "Missing Authorization header" });

  const token = authHeader.split(" ")[1];


  if (!token) return res.status(401).json({ message: "Malformed Authorization header" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};


module.exports = authMiddleware;
