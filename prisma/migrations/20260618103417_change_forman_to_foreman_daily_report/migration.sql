/*
  Warnings:

  - You are about to drop the column `forman` on the `DailyReport` table. All the data in the column will be lost.
  - Added the required column `foreman` to the `DailyReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyReport" DROP COLUMN "forman",
ADD COLUMN     "foreman" TEXT NOT NULL;
