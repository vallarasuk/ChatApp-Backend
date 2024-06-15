const fs = require("fs");
const path = require("path");
const { create } = require("domain");
require('dotenv').config();

// Log file paths
const logsDirectory = path.join(__dirname, "../logs");
const requestLogFilePath = path.join(logsDirectory, "request.log");
const errorLogFilePath = path.join(logsDirectory, "error.log");

// Middleware to create log directory if it doesn't exist
function createLogsDirectoryIfNotExists() {
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
  }
}

// Middleware to log HTTP requests
function requestLogger(req, res, next) {
  const logMessage = `${new Date().toISOString()} - ${req.method} request for ${req.url}\n`;

  // Check LOG_REPORT from environment variables
  const logReport = process.env.LOG_REPORT === "true"; // Convert string to boolean

  if (logReport) {
    // Create logs directory if it doesn't exist
    createLogsDirectoryIfNotExists();

    // Append request log to log file
    fs.appendFile(requestLogFilePath, logMessage, (err) => {
      if (err) {
        console.error("Error writing to request log:", err);
      }
    });
  }

  next(); // Call the next middleware or route handler
}

// Middleware to log errors
function errorLogger(err, req, res, next) {
  const logMessage = `${new Date().toISOString()} - ${err.stack}\n`;

  // Check LOG_REPORT from environment variables
  const logReport = process.env.LOG_REPORT === "true"; // Convert string to boolean

  if (logReport) {
    // Create logs directory if it doesn't exist
    createLogsDirectoryIfNotExists();

    // Append error log to error log file
    fs.appendFile(errorLogFilePath, logMessage, (appendErr) => {
      if (appendErr) {
        console.error("Error writing to error log:", appendErr);
      }
    });
  }

  // Call the next error handling middleware or route handler
  // next(err);
}

module.exports = {
  requestLogger,
  errorLogger,
};
