import express from "express";
import {
  getDashboardSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getWeeklyTrends,
} from "../controllers/dashboardController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = express.Router();

// Viewer can only see summary
router.get("/summary", auth, getDashboardSummary);

// Analyst and admin can see detailed analytics
router.get(
  "/categories",
  auth,
  roleCheck("admin", "analyst"),
  getCategoryTotals,
);
router.get("/monthly", auth, roleCheck("admin", "analyst"), getMonthlyTrends);
router.get("/weekly", auth, roleCheck("admin", "analyst"), getWeeklyTrends);
router.get("/recent", auth, roleCheck("admin", "analyst"), getRecentActivity);

export default router;
