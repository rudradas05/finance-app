import express from "express";
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  exportRecordsCSV,
} from "../controllers/recordController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import {
  createRecordValidator,
  updateRecordValidator,
} from "../validators/recordValidator.js";
import auditLog from "../middleware/auditLog.js";

const router = express.Router();

router.get("/", auth, roleCheck("admin", "analyst"), getAllRecords);
router.get("/export", auth, roleCheck("admin"), exportRecordsCSV);
router.get("/:id", auth, roleCheck("admin", "analyst"), getRecordById);
router.post(
  "/",
  auth,
  roleCheck("admin"),
  createRecordValidator,
  auditLog("CREATE", "record"),
  createRecord,
);
router.put(
  "/:id",
  auth,
  roleCheck("admin"),
  updateRecordValidator,
  auditLog("UPDATE", "record"),
  updateRecord,
);
router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  auditLog("DELETE", "record"),
  deleteRecord,
);

export default router;
