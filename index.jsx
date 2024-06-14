// index.js

const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON parsing
app.use(express.json());

// Use the user routes
app.use("/api", userRoutes); // Prefix all user routes with /api

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
