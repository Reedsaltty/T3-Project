/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `checklist` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `checklist` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `checklist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "checklist" DROP CONSTRAINT "checklist_assignedTo_fkey";

-- AlterTable
ALTER TABLE "checklist" DROP COLUMN "assignedTo",
DROP COLUMN "deadline",
DROP COLUMN "status",
ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false;
