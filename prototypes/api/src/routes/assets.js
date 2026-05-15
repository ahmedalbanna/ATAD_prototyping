import { Router } from "express";
import * as AssetService from "../services/asset.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// List assets with filters
router.get("/", async (req, res, next) => {
  try {
    const result = await AssetService.listAssets(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// Get single asset
router.get("/:id", async (req, res, next) => {
  try {
    const asset = await AssetService.getAsset(req.params.id);
    res.json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
});

// Create asset (lessor only)
router.post("/", authenticate, requireRole("lessor"), async (req, res, next) => {
  try {
    const asset = await AssetService.createAsset({ ...req.body, owner_id: req.user.id });
    res.status(201).json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
});

// Update asset (owner only)
router.put("/:id", authenticate, requireRole("lessor"), async (req, res, next) => {
  try {
    const asset = await AssetService.updateAsset(req.params.id, req.body);
    res.json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
});

// Toggle asset status (owner only)
router.patch("/:id/status", authenticate, requireRole("lessor"), async (req, res, next) => {
  try {
    const asset = await AssetService.toggleStatus(req.params.id, req.body.status, req.user.id);
    res.json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
});

// Delete asset (owner only)
router.delete("/:id", authenticate, requireRole("lessor"), async (req, res, next) => {
  try {
    const result = await AssetService.deleteAsset(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
