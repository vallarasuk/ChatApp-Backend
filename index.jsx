const express = require("express");
const userRoutes = require("./routes/userRoutes");
const knex = require("knex");
const knexfile = require("./knexfile");
const { requestLogger, errorLogger } = require("./middleware/requestLogger");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON parsing
app.use(express.json());

// Middleware for request logging
app.use(requestLogger);

// Use the user routes
app.use("/api", userRoutes);

// Connect to the database using Knex
const db = knex(knexfile.development);

// Function to run migrations
async function runMigrations() {
  try {
    // Ensure migrations are up to date
    await db.migrate.latest();
    console.log("Migrations have run successfully.");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1); // Exit the process with an error status
  }
}

// Run migrations and start server
async function startServer() {
  try {
    await runMigrations(); // Run migrations before starting the server

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with an error status
  }
}

// Error handling middleware
app.use(errorLogger);

// Call startServer to begin
startServer();
