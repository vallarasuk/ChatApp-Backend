const knex = require("knex");
const knexConfig = require("../knexfile");
const { errorLogger } = require("../middleware/requestLogger");

const db = knex(knexConfig.development);

// Function to get all categories
async function getAllCategories() {
  try {
    // Select both object_name and object_id from the database
    const categories = await db("user_category").select(
      "object_name",
      "object_id"
    );

    // Log request to history table
    await logHistory("GET", "/api/categories");

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to fetch categories" };
  }
}

// Function to get a category by ID
async function getCategoryById(categoryId) {
  try {
    const category = await db("user_category").where("id", categoryId).first();

    if (category) {
      // Log request to history table
      await logHistory("GET", `/api/categories/${categoryId}`);

      return { success: true, category };
    } else {
      return { success: false, error: "Category not found" };
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to fetch category" };
  }
}

// Function to create a new category
async function createCategory(object_name, object_id) {
  try {
    // Insert into database using Knex.js
    const [newCategory] = await db("user_category")
      .insert({ object_name, object_id })
      .returning(["id", "object_name", "object_id"]);

    // Log request to history table
    await logHistory("POST", "/api/categories");

    return {
      success: true,
      category: newCategory,
      message: "Category created successfully",
    };
  } catch (error) {
    console.error("Error creating category:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to create category" };
  }
}

// Function to update a category by ID
async function updateCategory(categoryId, object_name, object_id) {
  try {
    const updatedCategory = await db("user_category")
      .where("id", categoryId)
      .update({ object_name, object_id })
      .returning(["id", "object_name", "object_id"]);

    if (updatedCategory.length > 0) {
      // Log request to history table
      await logHistory("PUT", `/api/categories/${categoryId}`);

      return {
        success: true,
        category: updatedCategory[0],
        message: "Category updated successfully",
      };
    } else {
      return { success: false, error: "Category not found" };
    }
  } catch (error) {
    console.error("Error updating category:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to update category" };
  }
}

// Function to delete a category by ID
async function deleteCategory(categoryId) {
  try {
    const deletedCount = await db("user_category")
      .where("id", categoryId)
      .del();

    if (deletedCount > 0) {
      // Log request to history table
      await logHistory("DELETE", `/api/categories/${categoryId}`);

      return { success: true, message: "Category deleted successfully" };
    } else {
      return { success: false, error: "Category not found" };
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    errorLogger(error); // Log error using errorLogger middleware
    return { success: false, error: "Failed to delete category" };
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
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
