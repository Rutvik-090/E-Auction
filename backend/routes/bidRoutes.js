import express from "express";
import { getBidHistory, placeBid } from "../controllers/bidController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", protect, placeBid);
router.get("/:auctionId", getBidHistory);

export default router;
