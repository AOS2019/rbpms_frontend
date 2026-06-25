/*
  Warnings:

  - Added the required column `forman` to the `DailyReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyReport" ADD COLUMN     "forman" TEXT NOT NULL;
