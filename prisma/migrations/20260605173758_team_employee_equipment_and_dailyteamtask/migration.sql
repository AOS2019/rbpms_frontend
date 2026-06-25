/*
  Warnings:

  - You are about to drop the column `activityId` on the `DailyTeamTask` table. All the data in the column will be lost.
  - You are about to drop the column `dailyTeamId` on the `DailyTeamTask` table. All the data in the column will be lost.
  - You are about to drop the column `quantityDone` on the `DailyTeamTask` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `DailyTeamTask` table. All the data in the column will be lost.
  - You are about to drop the `DailyTeam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bridgeId` to the `DailyTeamTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyReportId` to the `DailyTeamTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `DailyTeamTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hoursWorked` to the `DailyTeamTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `DailyTeamTask` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DailyTeam" DROP CONSTRAINT "DailyTeam_dailyReportId_fkey";

-- DropForeignKey
ALTER TABLE "DailyTeamTask" DROP CONSTRAINT "DailyTeamTask_dailyTeamId_fkey";

-- AlterTable
ALTER TABLE "DailyTeamTask" DROP COLUMN "activityId",
DROP COLUMN "dailyTeamId",
DROP COLUMN "quantityDone",
DROP COLUMN "unit",
ADD COLUMN     "bridgeId" INTEGER NOT NULL,
ADD COLUMN     "dailyReportId" INTEGER NOT NULL,
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD COLUMN     "equipmentId" INTEGER,
ADD COLUMN     "hoursWorked" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "teamId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "DailyTeam";

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "staffId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "trade" TEXT,
    "designation" TEXT,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" SERIAL NOT NULL,
    "equipmentCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_staffId_key" ON "Employee"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_equipmentCode_key" ON "Equipment"("equipmentCode");

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
