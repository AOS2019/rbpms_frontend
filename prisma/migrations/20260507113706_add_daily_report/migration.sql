-- CreateTable
CREATE TABLE "Bridge" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Bridge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "siteEngineer" TEXT NOT NULL,
    "projectManager" TEXT NOT NULL,
    "weather" TEXT NOT NULL,
    "workHours" INTEGER NOT NULL,
    "bridgeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" SERIAL NOT NULL,
    "dailyReportId" INTEGER NOT NULL,
    "bridgeElementId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "pierNumber" TEXT,
    "quantityDone" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "concreteGrade" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyTeam" (
    "id" SERIAL NOT NULL,
    "dailyReportId" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyTeamTask" (
    "id" SERIAL NOT NULL,
    "dailyTeamId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "quantityDone" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTeamTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTeam" ADD CONSTRAINT "DailyTeam_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyTeamTask" ADD CONSTRAINT "DailyTeamTask_dailyTeamId_fkey" FOREIGN KEY ("dailyTeamId") REFERENCES "DailyTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
