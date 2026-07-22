/*
  Warnings:

  - You are about to drop the `DailyTeamTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DailyTeamTask" DROP CONSTRAINT "DailyTeamTask_bridgeId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTeamTask" DROP CONSTRAINT "DailyTeamTask_dailyReportId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTeamTask" DROP CONSTRAINT "DailyTeamTask_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTeamTask" DROP CONSTRAINT "DailyTeamTask_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTeamTask" DROP CONSTRAINT "DailyTeamTask_teamId_fkey";

-- DropTable
DROP TABLE "DailyTeamTask";

-- CreateTable
CREATE TABLE "DailyTask" (
    "id" SERIAL NOT NULL,
    "dailyReportId" INTEGER NOT NULL,
    "bridgeId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "activityCode" TEXT,
    "activity" TEXT NOT NULL,
    "locationCode" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyTaskManpower" (
    "id" SERIAL NOT NULL,
    "dailyTaskId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTaskManpower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentUsage" (
    "id" SERIAL NOT NULL,
    "dailyTaskId" INTEGER NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "operatorId" INTEGER,
    "startReading" DOUBLE PRECISION NOT NULL,
    "endReading" DOUBLE PRECISION NOT NULL,
    "totalReading" DOUBLE PRECISION NOT NULL,
    "standbyHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "breakdownHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fuelUsed" DOUBLE PRECISION,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentUsage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyTask" ADD CONSTRAINT "DailyTask_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTask" ADD CONSTRAINT "DailyTask_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTask" ADD CONSTRAINT "DailyTask_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTaskManpower" ADD CONSTRAINT "DailyTaskManpower_dailyTaskId_fkey" FOREIGN KEY ("dailyTaskId") REFERENCES "DailyTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTaskManpower" ADD CONSTRAINT "DailyTaskManpower_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentUsage" ADD CONSTRAINT "EquipmentUsage_dailyTaskId_fkey" FOREIGN KEY ("dailyTaskId") REFERENCES "DailyTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentUsage" ADD CONSTRAINT "EquipmentUsage_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentUsage" ADD CONSTRAINT "EquipmentUsage_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
