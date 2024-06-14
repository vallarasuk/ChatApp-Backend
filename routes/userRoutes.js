const express = require("express");
const userService = require("../services/userServices");

const router = express.Router();

// Middleware to log the HTTP method and the URL of each request
router.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next(); // Call the next middleware or route handler
});

// Route to create a new user (POST /api/users)
router.post("/users", async (req, res) => {
  console.log(req.body);
  const { username, email, password, re_password } = req.body;

  // Call userService to create user
  const result = await userService.createUser(
    username,
    email,
    password,
    re_password
  );

  if (result.success) {
    res.status(201).json({ message: result.message });
  } else {
    res.status(400).json({ errors: result.error });
  }
});

// Route to get a user by ID (GET /api/users/:id)
router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  // Call userService to get user
  const result = await userService.getUser(userId);

  if (result.success) {
    res.status(200).json(result.user);
  } else {
    res.status(404).json({ errors: result.error });
  }
});

// Route to delete a user by ID (DELETE /api/users/:id)
router.delete("/users/:id", async (req, res) => {
    console.log(req)
  const userId = req.params.id;

  // Call userService to delete user
  const result = await userService.deleteUser(userId);

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ errors: result.error });
  }
});

// Route to get users by search criteria (GET /api/users/search)
router.get("/users/search", async (req, res) => {
  const searchTerm = req.query.q; // The search term is passed as a query parameter, e.g., /api/users/search?q=john

  // Call userService to get users by search criteria
  const result = await userService.getUsersByCriteria(searchTerm);

  if (result.success) {
    res.status(200).json(result.users);
  } else {
    res.status(500).json({ errors: result.error });
  }
});

// Route to get all users (GET /api/users)
router.get("/users", async (req, res) => {
  // Call userService to get all users
  const result = await userService.getAllUsers();

  if (result.success) {
    res.status(200).json(result.users);
  } else {
    res.status(500).json({ errors: result.error });
  }
});

module.exports = router;
