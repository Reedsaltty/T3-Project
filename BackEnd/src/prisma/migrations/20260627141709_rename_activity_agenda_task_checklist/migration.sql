/*
  Warnings:

  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_eventId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_eventId_fkey";

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "tasks";

-- CreateTable
CREATE TABLE "checklist" (
    "checklistId" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "assignedTo" INTEGER,
    "description" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "deadline" TIMESTAMP(3),

    CONSTRAINT "checklist_pkey" PRIMARY KEY ("checklistId")
);

-- CreateTable
CREATE TABLE "agenda" (
    "agendaId" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agenda_pkey" PRIMARY KEY ("agendaId")
);

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda" ADD CONSTRAINT "agenda_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
