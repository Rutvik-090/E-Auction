import express from "express";
import {
  deleteUser,
  forceEndAuction,
  getAllAuctionsAdmin,
  getAllBids,
  getAllUsers,
  getDashboardStats,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes protected + admin only
router.use(protect, authorizeRoles("admin"));

// Dashboard
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Auctions
router.get("/auctions", getAllAuctionsAdmin);
router.put("/auction/:id/end", forceEndAuction);

// Bids
router.get("/bids", getAllBids);

export default router;
