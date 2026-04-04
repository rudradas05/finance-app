import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
  changePassword,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = express.Router();

// Any logged in user
router.get("/me", auth, getMyProfile);
router.put("/change-password", auth, changePassword);

// Admin only
router.get("/", auth, roleCheck("admin"), getAllUsers);
router.get("/:id", auth, roleCheck("admin"), getUserById);
router.put("/:id", auth, roleCheck("admin"), updateUser);
router.delete("/:id", auth, roleCheck("admin"), deleteUser);

export default router;
