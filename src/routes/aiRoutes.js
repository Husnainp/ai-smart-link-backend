import express from 'express';
import { generateDescriptionHandler } from '../controllers/aiController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/authorizeRoles.js';

const router = express.Router();

// Only admins may call the AI generator
router.post('/generate-description', requireAuth, requireRole(['admin']), generateDescriptionHandler);

export default router;
