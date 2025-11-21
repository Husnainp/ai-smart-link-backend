
import Site from '../models/siteModel.js';
import mongoose from 'mongoose';

async function createSiteService(data) {
  // create and return the new site document
  const site = await Site.create(data);
  return site;
}

async function listSitesService(filter = {}, options = {}) {
  // pagination support: options.page, options.limit, options.sort
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 10);
  const skip = (page - 1) * limit;

  const query = Site.find(filter);
  if (options.sort) query.sort(options.sort);
  query.limit(limit).skip(skip);

  const [results, total] = await Promise.all([query.exec(), Site.countDocuments(filter).exec()]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    results,
    page,
    limit,
    total,
    totalPages,
  };
}

async function getSiteService(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Site.findById(id).exec();
}

async function updateSiteService(id, data) {
  if (!mongoose.isValidObjectId(id)) return null;

  // Only allow specific fields to be updated.
  // Accept both snake_case and camelCase from clients (e.g., siteUrl -> site_url).
  const allowedFields = ['site_url', 'title', 'cover_image', 'description', 'category'];
  const keyMap = { siteUrl: 'site_url', coverImage: 'cover_image', cover_image: 'cover_image', site_url: 'site_url' };
  const updates = {};

  for (const key of Object.keys(data || {})) {
    const targetKey = keyMap[key] || key;
    if (allowedFields.includes(targetKey)) {
      updates[targetKey] = data[key];
    }
  }

  // If no allowed fields provided, return the existing document (no-op)
  if (Object.keys(updates).length === 0) {
    return await Site.findById(id).exec();
  }

  // Load the document, apply updates and save to ensure hooks and validators run
  const site = await Site.findById(id).exec();
  if (!site) return null;

  Object.assign(site, updates);
  await site.save();
  return site;
}

async function deleteSiteService(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return await Site.findByIdAndDelete(id).exec();
}

export { createSiteService, listSitesService, getSiteService, updateSiteService, deleteSiteService };
