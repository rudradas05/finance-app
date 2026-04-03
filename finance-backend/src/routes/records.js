import express from "express";
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/recordController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import {
  createRecordValidator,
  updateRecordValidator,
} from "../validators/recordValidator.js";

const router = express.Router();

// Admin + Analyst can view records
router.get("/", auth, roleCheck("admin", "analyst"), getAllRecords);
router.get("/:id", auth, roleCheck("admin", "analyst"), getRecordById);

// Admin only can create, update, delete
router.post("/", auth, roleCheck("admin"), createRecordValidator, createRecord);
router.put(
  "/:id",
  auth,
  roleCheck("admin"),
  updateRecordValidator,
  updateRecord,
);
router.delete("/:id", auth, roleCheck("admin"), deleteRecord);

export default router;
