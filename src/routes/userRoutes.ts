import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/profile", authenticateToken, getUserProfile);

router.put("/profile", authenticateToken, updateUserProfile);

router.delete("/profile", authenticateToken, deleteUserAccount);

export default router;
