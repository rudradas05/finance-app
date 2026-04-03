import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = express.Router();

// Any logged in user can see their own profile
router.get("/me", auth, getMyProfile);

// Admin only routes
router.get("/", auth, roleCheck("admin"), getAllUsers);
router.get("/:id", auth, roleCheck("admin"), getUserById);
router.put("/:id", auth, roleCheck("admin"), updateUser);
router.delete("/:id", auth, roleCheck("admin"), deleteUser);

export default router;
