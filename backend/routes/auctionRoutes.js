import express from "express";
import {
  createAuction,
  deleteAuction,
  getAllAuctions,
  getSingleAuction,
  updateAuction,
} from "../controllers/auctionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllAuctions);
router.get("/:id", getSingleAuction);

// Seller only
router.post(
  "/",
  protect,
  authorizeRoles("seller"),
  upload.single("image"),
  createAuction,
);
router.put("/:id", protect, authorizeRoles("seller"), updateAuction);
router.delete("/:id", protect, authorizeRoles("seller"), deleteAuction);

export default router;
