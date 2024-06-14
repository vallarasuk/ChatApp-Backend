const knex = require("knex");
const { development } = require("../knexfile");
const { hashPassword } = require("../helpers/bcryptHelper");
const { validatePasswordMatch } = require("../helpers/validationHelper");

// Knex instance for database connection
const db = knex(development);

// Function to check if a user already exists
async function userExists(email, username) {
  try {
    // Check if a user with the given email or username exists
    const emailCount = await db("users").where({ email }).count("* as count");
    if (emailCount[0].count > 0) {
      return "Email already in use";
    }

    const usernameCount = await db("users")
      .where({ username })
      .count("* as count");
    if (usernameCount[0].count > 0) {
      return "Username already in use";
    }

    return null; // No existing user found
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw new Error("Error checking user existence");
  }
}

// Function to create a new user with hashed password
async function createUser(username, email, password, re_password) {
  try {
    // Validate password match
    if (!validatePasswordMatch(password, re_password)) {
      return { success: false, error: "Passwords do not match" };
    }

    // Check if the user already exists by email or username
    const userExistenceMessage = await userExists(email, username);
    if (userExistenceMessage) {
      return { success: false, error: userExistenceMessage };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert into database using Knex.js
    await db("users").insert({
      username,
      email,
      password: hashedPassword,
      re_password: hashedPassword, // Storing the hashed password in re_password for consistency
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

// Function to get a user by ID
async function getUser(userId) {
  try {
    // Query the database to find a user by their ID
    const user = await db("users").where({ id: userId }).first();

    if (user) {
      // Exclude the password and re_password from the returned user data
      const { password, re_password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, error: "Failed to get user" };
  }
}

// Function to delete a user by ID
async function deleteUser(userId) {
  try {
    // Delete the user from the database by their ID
    const deleteCount = await db("users").where({ id: userId }).del();

    if (deleteCount) {
      return { success: true, message: "User deleted successfully" };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

// Function to get users by a search term (username)
async function getUsersByCriteria(searchTerm) {
  try {
    // Query the database to find users whose username matches the search term
    const users = await db("users")
      .where("username", "like", `%${searchTerm}%`)
      .select("id", "username", "email"); // Exclude sensitive fields

    return { success: true, users };
  } catch (error) {
    console.error("Error getting users by criteria:", error);
    return { success: false, error: "Failed to get users by criteria" };
  }
}

// Function to get all users
async function getAllUsers() {
  try {
    // Query the database to retrieve all users
    const users = await db("users").select("id", "username", "email"); // Exclude sensitive fields

    return { success: true, users };
  } catch (error) {
    console.error("Error getting all users:", error);
    return { success: false, error: "Failed to get all users" };
  }
}

module.exports = {
  createUser,
  getUser,
  deleteUser,
  getUsersByCriteria,
  getAllUsers,
};
