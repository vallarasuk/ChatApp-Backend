const express = require("express");
const userService = require("../services/userServices");
const { requestLogger } = require("../middleware/requestLogger");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

// Middleware to log HTTP requests
router.use(requestLogger);

// Route to create a new user (POST /api/users)
router.post("/users", async (req, res) => {
  const { username, email, password, re_password } = req.body;

  try {
    // Call userService to create user
    const result = await userService.createUser(
      username,
      email,
      password,
      re_password
    );

    if (result.success) {
      res.status(201).json({ user: result.user, message: result.message });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update a user by ID (PUT /api/users/:id)
router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  // Call userService to update user
  const result = await userService.updateUser(userId, username, email);

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Route to get a user by ID (GET /api/users/:userId)
router.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const result = await userService.getUser(userId);

  if (result.success) {
    res.status(200).json({ user: result.user });
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Route to delete a user by ID (DELETE /api/users/:id)
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  // Call userService to delete user
  const result = await userService.deleteUser(userId);

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
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
    res.status(500).json({ error: result.error });
  }
});

// Route to get all users (GET /api/users)
router.get("/users", async (req, res) => {
  // Call userService to get all users
  const result = await userService.getAllUsers();

  if (result.success) {
    res.status(200).json(result.users);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Route for user login (POST /api/users/login)
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Call userService to authenticate user
    const result = await userService.authenticateUser(email, password);

    if (result.success) {
      res.status(200).json({ user: result.user, message: "Login successful" });
    } else {
      res.status(401).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/validate-session", async (req, res) => {
  const { sessionToken, userId } = req.body;
  try {
    // Validate the session token and userId
    const { isValid, user } = await userService.validateSessionToken(
      sessionToken,
      userId
    );

    if (isValid) {
      // The session token and userId are valid
      return res.json({ isValid: true, user });
    } else {
      // The session token is not valid or userId does not match
      return res.json({ isValid: false });
    }
  } catch (error) {
    console.error("Error validating session token:", error);
    return res.status(500).json({ isValid: false });
  }
});

// Route to update default location
router.put("/api/users/update-location", async (req, res) => {
  const { sessionToken, defaultLocation } = req.body;

  try {
    // Update the user's default location
    const updatedUser = await userService.updateUserLocation(
      user.id,
      defaultLocation
    );

    if (updatedUser) {
      return res.json({
        message: "Location updated successfully",
        user: updatedUser,
      });
    } else {
      return res.status(400).json({ error: "Failed to update location" });
    }
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
