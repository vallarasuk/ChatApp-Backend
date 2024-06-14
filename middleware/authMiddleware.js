const jwt = require("jsonwebtoken");
const userService = require("../services/userServices");
const validateSession = require("../helpers/userValidateHelper");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify session token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if user session is valid
    const isValidSession = await validateSession(userId, token);

    if (!isValidSession) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach user ID to request object for use in subsequent routes
    req.userId = userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { authenticateUser };
