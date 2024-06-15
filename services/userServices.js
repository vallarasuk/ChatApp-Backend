const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const knex = require("knex");
const knexConfig = require("../knexfile");
const { errorLogger } = require("../middleware/requestLogger");
const validator = require("validator");
const crypto = require("crypto");

// Initialize Knex instance based on the development environment configuration
const db = knex(knexConfig.development);
const saltRounds = 5;

// Function to hash the password
async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Error hashing password");
  }
}

const sessionTimeout = 10 * 60; // 10 minutes in seconds

// Function to generate a 10-digit session token
function generate10DigitToken() {
  // Generate a 10-digit numeric token
  const buffer = crypto.randomBytes(5);
  return buffer.toString("hex").slice(0, 10); // Take first 10 characters of the hex string
}

// Function to create a new user
async function createUser(username, email, password, re_password) {
  try {
    // Validate password match
    if (password !== re_password) {
      return { success: false, error: "Passwords do not match" };
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Check if the user already exists by email or username
    const userExistenceMessage = await userExists(email, username);
    if (userExistenceMessage) {
      return { success: false, error: userExistenceMessage };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Generate a 10-digit session token
    const sessionToken = generate10DigitToken();

    // Insert into database using Knex.js
    await db("users").insert({
      username,
      email,
      password: hashedPassword,
      re_password: password,
      session_token: sessionToken, // Store the 10-digit session token
      session_expires_at: new Date(Date.now() + sessionTimeout * 1000), // Set session expiry
    });

    // Fetch the newly created user from database
    const newUser = await db("users")
      .where({ email })
      .select("id", "username", "email", "session_token")
      .first();

    // Log request to history table
    await logHistory("POST", "/api/users");

    return {
      success: true,
      user: newUser,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to create user" };
  }
}

// Function to get a user by ID
async function getUser(userId) {
  try {
    const user = await db("users")
      .where({ id: userId })
      .select("id", "username", "email", "session_token", "session_expires_at")
      .first();

    if (user) {
      // Log request to history table
      await logHistory("GET", `/api/users/${userId}`);

      return { success: true, user };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to get user" };
  }
}

// Function to delete a user by ID
async function deleteUser(userId) {
  try {
    const deletedUser = await db("users").where({ id: userId }).del();
    if (deletedUser) {
      // Log request to history table
      await logHistory("DELETE", `/api/users/${userId}`);

      return { success: true, message: "User deleted successfully" };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to delete user" };
  }
}

// Function to get users by search criteria
async function getUsersByCriteria(searchTerm) {
  try {
    const users = await db("users")
      .where("username", "like", `%${searchTerm}%`)
      .orWhere("email", "like", `%${searchTerm}%`);

    // Log request to history table
    await logHistory("GET", `/api/users/search?q=${searchTerm}`);

    return { success: true, users };
  } catch (error) {
    console.error("Error searching users:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to search users" };
  }
}

// Function to get all users
async function getAllUsers() {
  try {
    const users = await db("users").select("*");

    // Log request to history table
    await logHistory("GET", "/api/users");

    return { success: true, users };
  } catch (error) {
    console.error("Error getting all users:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to get all users" };
  }
}

// Function to check if a user already exists by email or username
async function userExists(email, username) {
  try {
    // Validate email format
    if (!validator.isEmail(email)) {
      return "Invalid email format";
    }

    // Check if a user with the given email exists
    const emailCount = await db("users").where({ email }).count("* as count");

    if (emailCount[0].count > 0) {
      return "Email already in use";
    }

    // Check if a user with the given username exists
    const usernameCount = await db("users")
      .where({ username })
      .count("* as count");

    if (usernameCount[0].count > 0) {
      return "Username already in use";
    }

    return null; // No existing user found
  } catch (error) {
    console.error("Error checking user existence:", error);
    errorLogger(error); // Log error using errorLogger middleware
    throw new Error("Error checking user existence");
  }
}

// Function to update a user by ID
async function updateUser(userId, username, email) {
  try {
    // Validate email format
    if (!validator.isEmail(email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Check if the user exists by ID
    const user = await db("users").where({ id: userId }).first();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if email is already in use by another user
    const emailInUse = await db("users")
      .whereNot({ id: userId })
      .where({ email })
      .first();
    if (emailInUse) {
      return { success: false, error: "Email already in use" };
    }

    // Update user details
    await db("users").where({ id: userId }).update({
      username,
      email,
    });

    // Log request to history table
    await logHistory("PUT", `/api/users/${userId}`);

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to update user" };
  }
}

// Function to log history
async function logHistory(method, url) {
  try {
    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    await db("history").insert({
      method,
      url,
      created_at,
    });
    console.log(`History logged: ${method} ${url}`);
  } catch (error) {
    console.error("Error logging history:", error);
    errorLogger(error); // Log error using errorLogger middleware
    throw new Error("Failed to log history");
  }
}

module.exports = {
  createUser,
  getUser,
  deleteUser,
  getUsersByCriteria,
  getAllUsers,
  userExists,
  logHistory,
  updateUser,
};
