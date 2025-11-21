import { createSiteService, listSitesService, getSiteService, updateSiteService, deleteSiteService } from '../services/siteService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const createSite = asyncHandler(async (req, res, next) => {
  const data = req.body;

  const site = await createSiteService(data);

  return res.status(201).json({
    success: true,
    message: 'Site created successfully',
    site,
  });
});

const listSites = asyncHandler(async (req, res) => {
  const sites = await listSitesService();
  return res.json( sites );
});

const getSite = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const site = await getSiteService(id);

  if (!site) return next(new ApiError(404, 'Site not found'));

  return res.json({ success: true, site });
});

const updateSite = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const site = await updateSiteService(id, data);

  if (!site) return next(new ApiError(404, 'Site not found'));

  return res.json({ success: true, message: 'Site updated', site });
});

const deleteSite = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const result = await deleteSiteService(id);

  // Assume service returns falsy when nothing was deleted
  if (result === false || result === null) return next(new ApiError(404, 'Site not found'));

  return res.status(204).send();
});

export { createSite, listSites, getSite, updateSite, deleteSite };
