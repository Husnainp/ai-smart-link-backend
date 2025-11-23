import express from 'express';
import { createCategory, listCategories, deleteCategory } from '../controllers/categoryController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/authorizeRoles.js';
import { validateCreateCategory } from '../joiValidations/categoryValidations.js';

const router = express.Router();

router.get('/', listCategories);
router.post('/', requireAuth, requireRole(['admin']), validateCreateCategory, createCategory);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteCategory);

export default router;
