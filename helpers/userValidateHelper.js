const knex = require("knex");
const jwt = require("jsonwebtoken");

const validateSession = async (userId, token) => {
  try {
    // Fetch user from database to verify if session exists
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return false; // User not found
    }

    // Check if the session token matches the one stored in the user record
    if (user.session_token !== token) {
      return false; // Session token mismatch
    }

    // Verify if the session token is expired
    if (new Date(user.session_expires_at) < new Date()) {
      return false; // Session token expired
    }

    // Verify the session token against the JWT secret
    jwt.verify(token, process.env.JWT_SECRET);

    // If all checks pass, session is valid
    return true;
  } catch (error) {
    console.error("Error validating session:", error);
    return false;
  }
};

module.exports = {
  validateSession,
};
