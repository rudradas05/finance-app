import prisma from "../config/db.js";

// ─── GET DASHBOARD SUMMARY ────────────────────────────────
export const getDashboardSummary = async (req, res) => {
  try {
    // Get all non-deleted records
    const records = await prisma.financialRecord.findMany({
      where: { isDeleted: false },
    });

    // Calculate totals
    const totalIncome = records
      .filter((r) => r.type === "income")
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);

    const totalExpense = records
      .filter((r) => r.type === "expense")
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);

    const netBalance = totalIncome - totalExpense;

    return res.status(200).json({
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      netBalance: netBalance.toFixed(2),
      totalRecords: records.length,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── GET CATEGORY WISE TOTALS ─────────────────────────────
export const getCategoryTotals = async (req, res) => {
  try {
    const records = await prisma.financialRecord.findMany({
      where: { isDeleted: false },
      select: { amount: true, type: true, category: true },
    });

    // Group by category
    const categoryMap = {};

    records.forEach((r) => {
      const key = r.category.toLowerCase();
      if (!categoryMap[key]) {
        categoryMap[key] = {
          category: r.category,
          income: 0,
          expense: 0,
          net: 0,
        };
      }
      const amount = parseFloat(r.amount);
      if (r.type === "income") {
        categoryMap[key].income += amount;
      } else {
        categoryMap[key].expense += amount;
      }
      categoryMap[key].net = categoryMap[key].income - categoryMap[key].expense;
    });

    const categories = Object.values(categoryMap).map((c) => ({
      category: c.category,
      income: c.income.toFixed(2),
      expense: c.expense.toFixed(2),
      net: c.net.toFixed(2),
    }));

    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Category totals error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── GET MONTHLY TRENDS ───────────────────────────────────
export const getMonthlyTrends = async (req, res) => {
  try {
    const records = await prisma.financialRecord.findMany({
      where: { isDeleted: false },
      select: { amount: true, type: true, date: true },
      orderBy: { date: "asc" },
    });

    // Group by month
    const monthMap = {};

    records.forEach((r) => {
      const date = new Date(r.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthMap[key]) {
        monthMap[key] = { month: key, income: 0, expense: 0, net: 0 };
      }

      const amount = parseFloat(r.amount);
      if (r.type === "income") {
        monthMap[key].income += amount;
      } else {
        monthMap[key].expense += amount;
      }
      monthMap[key].net = monthMap[key].income - monthMap[key].expense;
    });

    const trends = Object.values(monthMap).map((m) => ({
      month: m.month,
      income: m.income.toFixed(2),
      expense: m.expense.toFixed(2),
      net: m.net.toFixed(2),
    }));

    return res.status(200).json({ trends });
  } catch (error) {
    console.error("Monthly trends error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── GET RECENT ACTIVITY ──────────────────────────────────
export const getRecentActivity = async (req, res) => {
  try {
    const records = await prisma.financialRecord.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({ recentActivity: records });
  } catch (error) {
    console.error("Recent activity error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─── GET WEEKLY TRENDS ────────────────────────────────────
export const getWeeklyTrends = async (req, res) => {
  try {
    // Get records from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const records = await prisma.financialRecord.findMany({
      where: {
        isDeleted: false,
        date: { gte: sevenDaysAgo },
      },
      select: { amount: true, type: true, date: true },
      orderBy: { date: "asc" },
    });

    // Group by day
    const dayMap = {};

    records.forEach((r) => {
      const key = new Date(r.date).toISOString().split("T")[0];

      if (!dayMap[key]) {
        dayMap[key] = { date: key, income: 0, expense: 0, net: 0 };
      }

      const amount = parseFloat(r.amount);
      if (r.type === "income") {
        dayMap[key].income += amount;
      } else {
        dayMap[key].expense += amount;
      }
      dayMap[key].net = dayMap[key].income - dayMap[key].expense;
    });

    const weekly = Object.values(dayMap).map((d) => ({
      date: d.date,
      income: d.income.toFixed(2),
      expense: d.expense.toFixed(2),
      net: d.net.toFixed(2),
    }));

    return res.status(200).json({ weekly });
  } catch (error) {
    console.error("Weekly trends error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
