import prisma from "../config/db.js";

//  GET ALL AUDIT LOGS (admin only) 
export const getAuditLogs = async (req, res) => {
  const {
    userId,
    action,
    resource,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = req.query;

  try {
    const where = {};

    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: "insensitive" };
    if (resource) where.resource = { contains: resource, mode: "insensitive" };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await prisma.auditLog.count({ where });

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      logs,
    });
  } catch (error) {
    console.error("Get audit logs error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
