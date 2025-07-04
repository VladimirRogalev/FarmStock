/*
  Warnings:

  - You are about to drop the column `coordinates` on the `farm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "farm" DROP COLUMN "coordinates",
ADD COLUMN     "latitude" DECIMAL(65,30),
ADD COLUMN     "longitude" DECIMAL(65,30);
