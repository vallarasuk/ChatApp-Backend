const bcrypt = require("bcrypt");
const saltRounds = 10;
const knex = require("knex");
const { development } = require("../knexfile");

// Knex instance for database connection
const db = knex(development);
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

// Function to create a new user with hashed password
async function createUser(username, email, password, re_password) {
  try {
    // Validate password match
    if (password !== re_password) {
      return { success: false, error: "Passwords do not match" };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert into database using Knex.js
    await db("users").insert({
      username,
      email,
      password: hashedPassword,
      re_password: re_password,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

module.exports = {
  createUser,
};
