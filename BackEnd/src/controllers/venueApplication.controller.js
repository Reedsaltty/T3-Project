import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";

// ─────────────────────────────────────────────
// 1. User: Submit a Venue Application
// ─────────────────────────────────────────────
export const submitApplication = async (req, res) => {
  try {
    const { venueName, venueLocation, venueCapacity, contactEmail, description } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Rule 1: Check if user already has a pending application
    const existingPendingApp = await prisma.venueApplication.findFirst({
      where: { userId, status: 'pending' }
    });
    if (existingPendingApp) {
      return res.status(409).json({ message: "You already have a pending venue application. Please wait for review." });
    }

    // Rule 2: Check if venue name already exists globally
    const existingVenue = await prisma.venue.findFirst({
      where: { name: { equals: venueName, mode: 'insensitive' } }
    });
    if (existingVenue) {
      return res.status(409).json({ message: "A venue with this name already exists on the platform." });
    }

    // 1. Create the application
    const application = await prisma.venueApplication.create({
      data: {
        userId,
        venueName,
        venueLocation,
        venueCapacity,
        contactEmail,
        description,
        status: 'pending'
      }
    });

    // 2. Notify all admins
    const admins = await prisma.userRole.findMany({
      where: { role: { roleName: 'admin' } },
      select: { userId: true }
    });

    const notificationsToCreate = admins.map(admin => ({
      userId: admin.userId,
      type: 'venue_app_submitted',
      title: 'New Venue Application',
      message: `${req.user.username || 'A user'} has submitted a venue application for '${venueName}'.`
    }));

    if (notificationsToCreate.length > 0) {
      await prisma.notification.createMany({ data: notificationsToCreate });
    }

    return res.status(201).json({ 
      message: "Application submitted successfully", 
      applicationId: application.applicationId 
    });
  } catch (err) {
    handleServerError(res, err, "Internal server error while submitting application");
  }
};

// ─────────────────────────────────────────────
// 2. User: View Own Applications
// ─────────────────────────────────────────────
export const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.venueApplication.findMany({
      where: { userId: req.user.userId },
      orderBy: { submittedAt: 'desc' }
    });
    return res.status(200).json(applications);
  } catch (err) {
    handleServerError(res, err, "Failed to fetch your applications");
  }
};

// ─────────────────────────────────────────────
// 3. Admin: View All Pending Applications
// ─────────────────────────────────────────────
export const getAllPendingApplications = async (req, res) => {
  try {
    const applications = await prisma.venueApplication.findMany({
      where: { status: 'pending' },
      include: {
        applicant: { select: { username: true, email: true } }
      },
      orderBy: { submittedAt: 'asc' }
    });
    return res.status(200).json(applications);
  } catch (err) {
    handleServerError(res, err, "Failed to fetch pending applications");
  }
};

// ─────────────────────────────────────────────
// 4. Admin: Approve Application
// ─────────────────────────────────────────────
export const approveApplication = async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const adminId = req.user.userId;

    const application = await prisma.venueApplication.findUnique({
      where: { applicationId }
    });

    if (!application) {
      return res.status(404).json({ message: "Venue application not found" });
    }
    if (application.status !== 'pending') {
      return res.status(409).json({ message: "This application has already been reviewed" });
    }

    // Execute in a transaction to ensure everything succeeds or fails together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update application status
      const updatedApp = await tx.venueApplication.update({
        where: { applicationId },
        data: {
          status: 'approved',
          reviewedBy: adminId,
          reviewedAt: new Date()
        }
      });

      // 2. Create the Venue
      const newVenue = await tx.venue.create({
        data: {
          name: application.venueName,
          location: application.venueLocation,
          capacity: application.venueCapacity,
          contactEmail: application.contactEmail,
          ownerId: application.userId,
          isActive: true
        }
      });

      // 3. Assign 'venue_owner' role to the applicant (if they don't have it)
      const venueOwnerRole = await tx.role.findFirst({ where: { roleName: 'venue_owner' } });
      if (venueOwnerRole) {
        await tx.userRole.upsert({
          where: {
            userId_roleId: {
              userId: application.userId,
              roleId: venueOwnerRole.roleId
            }
          },
          update: {},
          create: {
            userId: application.userId,
            roleId: venueOwnerRole.roleId
          }
        });
      }

      // 4. Notify the applicant
      await tx.notification.create({
        data: {
          userId: application.userId,
          type: 'venue_app_approved',
          title: 'Venue Application Approved!',
          message: `Your venue '${application.venueName}' has been approved and is now listed on the platform.`,
          metadata: { venueId: newVenue.venueId, venueName: newVenue.name }
        }
      });

      return newVenue;
    });

    return res.status(200).json({ 
      message: "Application approved successfully", 
      venueId: result.venueId 
    });
  } catch (err) {
    handleServerError(res, err, "Failed to approve application");
  }
};

// ─────────────────────────────────────────────
// 5. Admin: Reject Application
// ─────────────────────────────────────────────
export const rejectApplication = async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const adminId = req.user.userId;
    const { rejectionReason } = req.body;

    const application = await prisma.venueApplication.findUnique({
      where: { applicationId }
    });

    if (!application) {
      return res.status(404).json({ message: "Venue application not found" });
    }
    if (application.status !== 'pending') {
      return res.status(409).json({ message: "This application has already been reviewed" });
    }

    // Wrap in transaction (update app + create notification)
    await prisma.$transaction(async (tx) => {
      await tx.venueApplication.update({
        where: { applicationId },
        data: {
          status: 'rejected',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          rejectionReason
        }
      });

      await tx.notification.create({
        data: {
          userId: application.userId,
          type: 'venue_app_rejected',
          title: 'Venue Application Not Approved',
          message: `Your venue application for '${application.venueName}' was not approved. Reason: ${rejectionReason}`
        }
      });
    });

    return res.status(200).json({ message: "Application rejected successfully" });
  } catch (err) {
    handleServerError(res, err, "Failed to reject application");
  }
};
