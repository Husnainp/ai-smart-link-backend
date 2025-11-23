import Category from '../models/categoryModel.js';
import mongoose from 'mongoose';

async function createCategoryService(data) {
  const category = await Category.create(data);
  return category;
}

async function listCategoriesService() {
  return await Category.find({}).sort({ name: 1 }).exec();
}

async function getCategoryService(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Category.findById(id).exec();
}

async function deleteCategoryService(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Category.findByIdAndDelete(id).exec();
}

export { createCategoryService, listCategoriesService, getCategoryService, deleteCategoryService };
