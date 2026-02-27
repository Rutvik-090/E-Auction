import express from "express";
import {
  getAllUsers,
  getUser,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

// GET default user
router.get("/", getUser);

// GET all users
router.get("/all", getAllUsers);

// GET user by ID
router.get("/:id", getUserById);

export default router;
