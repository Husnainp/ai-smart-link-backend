import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { createCategoryService, listCategoriesService, deleteCategoryService } from '../services/categoryService.js';

const createCategory = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const category = await createCategoryService(data);

  return res.status(201).json({ success: true, message: 'Category created', category });
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await listCategoriesService();
  return res.json({ success: true, results: categories });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const deleted = await deleteCategoryService(id);

  if (!deleted) return next(new ApiError(404, 'Category not found'));

  return res.status(204).send();
});

export { createCategory, listCategories, deleteCategory };
