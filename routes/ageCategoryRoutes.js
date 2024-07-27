const express = require("express");
const router = express.Router();
const ageCategoryService = require("../services/ageCategoryService");

// Route to get all age categories (GET /api/age-categories)
router.get("/age-categories", async (req, res) => {
  const result = await ageCategoryService.getAllAgeCategories();
  if (result.success) {
    res.status(200).json(result.ageCategories);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Route to get an age category by ID (GET /api/age-categories/:id)
router.get("/age-categories/:id", async (req, res) => {
  const categoryId = req.params.id;
  const result = await ageCategoryService.getAgeCategoryById(categoryId);
  if (result.success) {
    res.status(200).json(result.ageCategory);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Route to create a new age category (POST /api/age-categories)
router.post("/age-categories", async (req, res) => {
  const { object_name, object_id } = req.body;
  const result = await ageCategoryService.createAgeCategory(
    object_name,
    object_id
  );
  if (result.success) {
    res
      .status(201)
      .json({ ageCategory: result.ageCategory, message: result.message });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Route to update an age category by ID (PUT /api/age-categories/:id)
router.put("/age-categories/:id", async (req, res) => {
  const categoryId = req.params.id;
  const { object_name, object_id } = req.body;
  const result = await ageCategoryService.updateAgeCategory(
    categoryId,
    object_name,
    object_id
  );
  if (result.success) {
    res
      .status(200)
      .json({ ageCategory: result.ageCategory, message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Route to delete an age category by ID (DELETE /api/age-categories/:id)
router.delete("/age-categories/:id", async (req, res) => {
  const categoryId = req.params.id;
  const result = await ageCategoryService.deleteAgeCategory(categoryId);
  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
});

module.exports = router;
