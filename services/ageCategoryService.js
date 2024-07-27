const knex = require("knex");
const knexConfig = require("../knexfile");
const { errorLogger } = require("../middleware/requestLogger");

const db = knex(knexConfig.development);

// Function to get all age categories
async function getAllAgeCategories() {
  try {
    // Select both object_name and object_id from the database
    const ageCategories = await db("age_category").select(
      "object_name",
      "object_id"
    );
    console.log("ageCategories---->", ageCategories);
    // Log request to history table
    await logHistory("GET", "/api/age-categories");

    return { success: true, ageCategories };
  } catch (error) {
    console.error("Error fetching age categories:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to fetch age categories" };
  }
}

// Function to get an age category by ID
async function getAgeCategoryById(categoryId) {
  try {
    const ageCategory = await db("age_category")
      .where("id", categoryId)
      .first();

    if (ageCategory) {
      // Log request to history table
      await logHistory("GET", `/api/age-categories/${categoryId}`);

      return { success: true, ageCategory };
    } else {
      return { success: false, error: "Age category not found" };
    }
  } catch (error) {
    console.error("Error fetching age category:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to fetch age category" };
  }
}

// Function to create a new age category
async function createAgeCategory(object_name, object_id) {
  try {
    // Insert into database using Knex.js
    const [newAgeCategory] = await db("age_category")
      .insert({ object_name, object_id })
      .returning(["id", "object_name", "object_id"]);

    // Log request to history table
    await logHistory("POST", "/api/age-categories");

    return {
      success: true,
      ageCategory: newAgeCategory,
      message: "Age category created successfully",
    };
  } catch (error) {
    console.error("Error creating age category:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to create age category" };
  }
}

// Function to update an age category by ID
async function updateAgeCategory(categoryId, object_name, object_id) {
  try {
    const updatedAgeCategory = await db("age_category")
      .where("id", categoryId)
      .update({ object_name, object_id })
      .returning(["id", "object_name", "object_id"]);

    if (updatedAgeCategory.length > 0) {
      // Log request to history table
      await logHistory("PUT", `/api/age-categories/${categoryId}`);

      return {
        success: true,
        ageCategory: updatedAgeCategory[0],
        message: "Age category updated successfully",
      };
    } else {
      return { success: false, error: "Age category not found" };
    }
  } catch (error) {
    console.error("Error updating age category:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to update age category" };
  }
}

// Function to delete an age category by ID
async function deleteAgeCategory(categoryId) {
  try {
    const deletedCount = await db("age_category").where("id", categoryId).del();

    if (deletedCount > 0) {
      // Log request to history table
      await logHistory("DELETE", `/api/age-categories/${categoryId}`);

      return { success: true, message: "Age category deleted successfully" };
    } else {
      return { success: false, error: "Age category not found" };
    }
  } catch (error) {
    console.error("Error deleting age category:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to delete age category" };
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
  getAllAgeCategories,
  getAgeCategoryById,
  createAgeCategory,
  updateAgeCategory,
  deleteAgeCategory,
};
