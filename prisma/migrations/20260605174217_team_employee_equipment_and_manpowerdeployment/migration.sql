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
CREATE TABLE "DailyManpowerDeployment" (
    "id" SERIAL NOT NULL,
    "dailyReportId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "bridgeId" INTEGER NOT NULL,
    "equipmentId" INTEGER,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyManpowerDeployment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyManpowerDeployment" ADD CONSTRAINT "DailyManpowerDeployment_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyManpowerDeployment" ADD CONSTRAINT "DailyManpowerDeployment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyManpowerDeployment" ADD CONSTRAINT "DailyManpowerDeployment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyManpowerDeployment" ADD CONSTRAINT "DailyManpowerDeployment_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyManpowerDeployment" ADD CONSTRAINT "DailyManpowerDeployment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
