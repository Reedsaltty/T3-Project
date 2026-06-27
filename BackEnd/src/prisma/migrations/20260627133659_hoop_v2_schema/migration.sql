/*
  Warnings:

  - You are about to drop the column `eventId` on the `venues` table. All the data in the column will be lost.
  - Added the required column `eventEndTime` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventSize` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "EventSize" AS ENUM ('small', 'big');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('event_created', 'event_updated', 'event_cancelled', 'event_reminder', 'venue_app_submitted', 'venue_app_approved', 'venue_app_rejected', 'booking_request', 'booking_approved', 'booking_rejected', 'rsvp_update');

-- DropForeignKey
ALTER TABLE "venues" DROP CONSTRAINT "venues_eventId_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "description" TEXT,
ADD COLUMN     "dressCode" VARCHAR(50),
ADD COLUMN     "eventEndTime" TIME NOT NULL,
ADD COLUMN     "eventSize" "EventSize" NOT NULL,
ADD COLUMN     "expectedGuests" INTEGER,
ADD COLUMN     "locationAddress" VARCHAR(500),
ADD COLUMN     "locationLabel" VARCHAR(200),
ADD COLUMN     "locationLat" DECIMAL(10,7),
ADD COLUMN     "locationLng" DECIMAL(10,7),
ADD COLUMN     "reminderSentAt" TIMESTAMP(3),
ADD COLUMN     "specialNotes" TEXT,
ALTER COLUMN "budget" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "eventId" INTEGER,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "title" VARCHAR(200) NOT NULL,
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "venues" DROP COLUMN "eventId",
ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "contactEmail" VARCHAR(150) NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ownerId" INTEGER,
ADD COLUMN     "priceRange" VARCHAR(50);

-- CreateTable
CREATE TABLE "venue_bookings" (
    "bookingId" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "venue_bookings_pkey" PRIMARY KEY ("bookingId")
);

-- CreateTable
CREATE TABLE "venue_applications" (
    "applicationId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "venueName" VARCHAR(150) NOT NULL,
    "venueLocation" VARCHAR(255) NOT NULL,
    "venueCapacity" INTEGER NOT NULL,
    "contactEmail" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "reviewedBy" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,

    CONSTRAINT "venue_applications_pkey" PRIMARY KEY ("applicationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "venue_bookings_eventId_key" ON "venue_bookings"("eventId");

-- AddForeignKey
ALTER TABLE "venues" ADD CONSTRAINT "venues_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_bookings" ADD CONSTRAINT "venue_bookings_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("venueId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_bookings" ADD CONSTRAINT "venue_bookings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_applications" ADD CONSTRAINT "venue_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_applications" ADD CONSTRAINT "venue_applications_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE SET NULL ON UPDATE CASCADE;
