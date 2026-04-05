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
import auditLog from "../middleware/auditLog.js";

const router = express.Router();

router.get("/me", auth, getMyProfile);
router.put(
  "/change-password",
  auth,
  auditLog("CHANGE_PASSWORD", "user"),
  changePassword,
);

router.get("/", auth, roleCheck("admin"), getAllUsers);
router.get("/:id", auth, roleCheck("admin"), getUserById);
router.put(
  "/:id",
  auth,
  roleCheck("admin"),
  auditLog("UPDATE", "user"),
  updateUser,
);
router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  auditLog("DELETE", "user"),
  deleteUser,
);

export default router;
