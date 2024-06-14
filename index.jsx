// index.js

const express = require("express");
const userService = require("./services/userServices");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON parsing
app.use(express.json());

// API route to create a new user
app.post("/api/users", async (req, res) => {
  console.log(req);
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
