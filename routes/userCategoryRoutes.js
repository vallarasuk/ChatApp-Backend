const express = require("express");
const router = express.Router();
const categoryService = require("../services/categoryService");

// Route to get all categories (GET /api/categories)
router.get("/categories", async (req, res) => {
  const result = await categoryService.getAllCategories();
  if (result.success) {
    res.status(200).json(result.categories);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Route to get a category by ID (GET /api/categories/:id)
router.get("/categories/:id", async (req, res) => {
  const categoryId = req.params.id;
  const result = await categoryService.getCategoryById(categoryId);
  if (result.success) {
    res.status(200).json(result.category);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Route to create a new category (POST /api/categories)
router.post("/categories", async (req, res) => {
  const { object_name, object_id } = req.body;
  const result = await categoryService.createCategory(object_name, object_id);
  if (result.success) {
    res.status(201).json({ category: result.category, message: result.message });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Route to update a category by ID (PUT /api/categories/:id)
router.put("/categories/:id", async (req, res) => {
  const categoryId = req.params.id;
  const { object_name, object_id } = req.body;
  const result = await categoryService.updateCategory(categoryId, object_name, object_id);
  if (result.success) {
    res.status(200).json({ category: result.category, message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Route to delete a category by ID (DELETE /api/categories/:id)
router.delete("/categories/:id", async (req, res) => {
  const categoryId = req.params.id;
  const result = await categoryService.deleteCategory(categoryId);
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
});

module.exports = router;
