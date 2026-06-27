import prisma from "../config/prisma.config.js";

/**
 * Restricts access to users who hold at least one of the specified roles.
 * Must be used AFTER authMiddleware (which sets req.user).
 *
 * Usage:
 *   router.get('/admin/venues', authorizeRoles('admin'), getAdminVenues);
 *   router.post('/venues', authorizeRoles('venue_owner', 'admin'), createVenue);
 */
export function authorizeRoles(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: { role: true },
      });

      const roleNames = userRoles.map((ur) => ur.role.roleName);

      if (roleNames.length === 0) {
        return res.status(403).json({
          message: "No roles assigned to your account",
          requiredRoles: allowedRoles,
        });
      }

      const hasPermission = allowedRoles.some((role) => roleNames.includes(role));

      if (!hasPermission) {
        return res.status(403).json({
          message: "Forbidden: You do not have the required role to access this resource",
          requiredRoles: allowedRoles,
          yourRoles: roleNames,
        });
      }

      // Attach roles to request for downstream use
      req.userRoles = roleNames;
      next();
    } catch (err) {
      return res.status(500).json({ message: "Internal server error during role check" });
    }
  };
}
