import prisma from "../config/db.js";

const auditLog = (action, resource) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: req.user?.id || null,
              userEmail: req.user?.email || null,
              action,
              resource,
              resourceId: req.params?.id || null,
              details: JSON.stringify({
                method: req.method,
                url: req.originalUrl,
                body: sanitizeBody(req.body),
              }),
              ipAddress: req.ip,
            },
          });
        } catch (error) {
          console.error("Audit log error:", error.message);
        }
      }

      return originalJson(body);
    };

    next();
  };
};

const sanitizeBody = (body) => {
  if (!body) return {};
  const sanitized = { ...body };
  delete sanitized.password;
  delete sanitized.currentPassword;
  delete sanitized.newPassword;
  return sanitized;
};

export default auditLog;
