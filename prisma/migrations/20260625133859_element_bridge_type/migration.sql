/*
  Warnings:

  - You are about to drop the column `bridgeId` on the `Element` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Element" DROP CONSTRAINT "Element_bridgeId_fkey";

-- AlterTable
ALTER TABLE "Element" DROP COLUMN "bridgeId",
ADD COLUMN     "bridgeType" "BridgeType";
