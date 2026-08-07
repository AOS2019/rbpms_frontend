/*
  Warnings:

  - You are about to drop the column `teamId` on the `DailyTask` table. All the data in the column will be lost.
  - You are about to drop the column `dailyTaskId` on the `EquipmentUsage` table. All the data in the column will be lost.
  - You are about to drop the column `operatorId` on the `EquipmentUsage` table. All the data in the column will be lost.
  - You are about to drop the `DailyActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyTaskManpower` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[crewCode]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `crewId` to the `DailyTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `DailyTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DailyTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyReportId` to the `EquipmentUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeAttendanceId` to the `EquipmentUsage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EquipmentUsage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'MISSION', 'SICK', 'JUSTIFIED_ABSENCE');

-- DropForeignKey
ALTER TABLE "DailyActivity" DROP CONSTRAINT "DailyActivity_bridgeId_fkey";

-- DropForeignKey
ALTER TABLE "DailyActivity" DROP CONSTRAINT "DailyActivity_dailyReportId_fkey";

-- DropForeignKey
ALTER TABLE "DailyActivity" DROP CONSTRAINT "DailyActivity_elementId_fkey";

-- DropForeignKey
ALTER TABLE "DailyActivity" DROP CONSTRAINT "DailyActivity_teamId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTask" DROP CONSTRAINT "DailyTask_teamId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTaskManpower" DROP CONSTRAINT "DailyTaskManpower_assignedFromTeamId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTaskManpower" DROP CONSTRAINT "DailyTaskManpower_dailyTaskId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTaskManpower" DROP CONSTRAINT "DailyTaskManpower_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentUsage" DROP CONSTRAINT "EquipmentUsage_dailyTaskId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentUsage" DROP CONSTRAINT "EquipmentUsage_operatorId_fkey";

-- AlterTable
ALTER TABLE "DailyTask" DROP COLUMN "teamId",
ADD COLUMN     "concreteGrade" TEXT,
ADD COLUMN     "crewId" INTEGER NOT NULL,
ADD COLUMN     "elementId" INTEGER,
ADD COLUMN     "pierNumber" TEXT,
ADD COLUMN     "quantityDone" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EquipmentUsage" DROP COLUMN "dailyTaskId",
DROP COLUMN "operatorId",
ADD COLUMN     "dailyReportId" INTEGER NOT NULL,
ADD COLUMN     "employeeAttendanceId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bridgeId" INTEGER,
ADD COLUMN     "crewCode" TEXT;

-- DropTable
DROP TABLE "DailyActivity";

-- DropTable
DROP TABLE "DailyTaskManpower";

-- CreateTable
CREATE TABLE "Crew" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "crewCode" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMember" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAttendance" (
    "id" SERIAL NOT NULL,
    "dailyReportId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "attendanceStatus" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "remarks" TEXT,
    "assignedBridgeId" INTEGER,
    "assignedCrewId" INTEGER,
    "hoursWorked" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Crew_teamId_crewCode_key" ON "Crew"("teamId", "crewCode");

-- CreateIndex
CREATE INDEX "CrewMember_employeeId_idx" ON "CrewMember"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "CrewMember_crewId_employeeId_key" ON "CrewMember"("crewId", "employeeId");

-- CreateIndex
CREATE INDEX "EmployeeAttendance_employeeId_idx" ON "EmployeeAttendance"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeAttendance_dailyReportId_employeeId_key" ON "EmployeeAttendance"("dailyReportId", "employeeId");

-- CreateIndex
CREATE INDEX "DailyTask_dailyReportId_idx" ON "DailyTask"("dailyReportId");

-- CreateIndex
CREATE INDEX "DailyTask_crewId_idx" ON "DailyTask"("crewId");

-- CreateIndex
CREATE INDEX "DailyTask_bridgeId_idx" ON "DailyTask"("bridgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_crewCode_key" ON "Team"("crewCode");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_assignedBridgeId_fkey" FOREIGN KEY ("assignedBridgeId") REFERENCES "Bridge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_assignedCrewId_fkey" FOREIGN KEY ("assignedCrewId") REFERENCES "Crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTask" ADD CONSTRAINT "DailyTask_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTask" ADD CONSTRAINT "DailyTask_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentUsage" ADD CONSTRAINT "EquipmentUsage_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentUsage" ADD CONSTRAINT "EquipmentUsage_employeeAttendanceId_fkey" FOREIGN KEY ("employeeAttendanceId") REFERENCES "EmployeeAttendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
