/*
  Warnings:

  - You are about to drop the `DailyManpowerDeployment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DailyManpowerDeployment" DROP CONSTRAINT "DailyManpowerDeployment_bridgeId_fkey";

-- DropForeignKey
ALTER TABLE "DailyManpowerDeployment" DROP CONSTRAINT "DailyManpowerDeployment_dailyReportId_fkey";

-- DropForeignKey
ALTER TABLE "DailyManpowerDeployment" DROP CONSTRAINT "DailyManpowerDeployment_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "DailyManpowerDeployment" DROP CONSTRAINT "DailyManpowerDeployment_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "DailyManpowerDeployment" DROP CONSTRAINT "DailyManpowerDeployment_teamId_fkey";

-- DropTable
DROP TABLE "DailyManpowerDeployment";

-- CreateTable
CREATE TABLE "DailyTeamTask" (
    "id" SERIAL NOT NULL,
    "dailyReportId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "bridgeId" INTEGER NOT NULL,
    "equipmentId" INTEGER,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTeamTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyTeamTask" ADD CONSTRAINT "DailyTeamTask_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTeamTask" ADD CONSTRAINT "DailyTeamTask_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTeamTask" ADD CONSTRAINT "DailyTeamTask_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTeamTask" ADD CONSTRAINT "DailyTeamTask_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTeamTask" ADD CONSTRAINT "DailyTeamTask_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
