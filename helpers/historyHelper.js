// helpers/historyHelper.js

const db = require("../knexfile");

async function logHistory(method, url) {
  try {
    await db("history").insert({
      method,
      url,
      created_at: new Date().toISOString(),
    });
    console.log(`History logged: ${method} ${url}`);
  } catch (error) {
    console.error("Error logging history:", error);
    throw new Error("Failed to log history");
  }
}

module.exports = {
  logHistory,
};
