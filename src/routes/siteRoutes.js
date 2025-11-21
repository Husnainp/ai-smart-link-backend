import express from 'express';
import { createSite, listSites, getSite, updateSite, deleteSite } from '../controllers/siteController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/authorizeRoles.js';
import { validateCreateSite, validateUpdateSite } from '../joiValidations/siteValidations.js';



const router = express.Router();


router.get('/', listSites);
router.get('/:id', getSite);

// Protected: admin-only create/update/delete
router.post('/', requireAuth, requireRole(['admin']), validateCreateSite, createSite);
router.patch('/:id', requireAuth, requireRole(['admin']), validateUpdateSite, updateSite);
router.delete('/:id', requireAuth, requireRole(['admin']), deleteSite);

export default router;
