import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = express.Router();

// Admin only
router.get("/", auth, roleCheck("admin"), getAuditLogs);

export default router;
