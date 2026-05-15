import * as AssetModel from "../models/Asset.js";
import { AppError } from "../middleware/errorHandler.js";

export async function listAssets(filters) {
  const result = await AssetModel.findAll(filters);
  return {
    data: result.rows.map(formatAsset),
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      pages: Math.ceil(result.total / result.limit),
    },
  };
}

export async function getAsset(id) {
  const asset = await AssetModel.findById(id);
  if (!asset) throw new AppError(404, "NOT_FOUND", "الأصل غير موجود");
  return formatAsset(asset);
}

export async function createAsset(data) {
  const asset = await AssetModel.create(data);
  return formatAsset(asset);
}

export async function updateAsset(id, data) {
  const asset = await AssetModel.update(id, data);
  if (!asset) throw new AppError(404, "NOT_FOUND", "الأصل غير موجود");
  return formatAsset(asset);
}

export async function toggleStatus(id, status, ownerId) {
  if (!AssetModel.ASSET_STATUSES.includes(status)) {
    throw new AppError(400, "VALIDATION_ERROR", "حالة الأصل غير صالحة");
  }
  const asset = await AssetModel.updateStatus(id, status, ownerId);
  if (!asset) throw new AppError(404, "NOT_FOUND", "الأصل غير موجود أو لا تملك صلاحية التعديل");
  return formatAsset(asset);
}

export async function deleteAsset(id, ownerId) {
  const deleted = AssetModel.remove(id, ownerId);
  if (!deleted) throw new AppError(404, "NOT_FOUND", "الأصل غير موجود أو لا تملك صلاحية الحذف");
  return { id };
}

function formatAsset(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    price_per_day: parseFloat(row.price_per_day),
    city: row.city,
    image_url: row.image_url,
    rating: parseFloat(row.rating),
    status: row.status,
    owner: {
      id: row.owner_id,
      name: row.owner_name,
      phone: row.owner_phone,
    },
    created_at: row.created_at,
  };
}
