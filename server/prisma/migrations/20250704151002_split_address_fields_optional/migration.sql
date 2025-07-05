/*
  Warnings:

  - You are about to drop the column `address` on the `farm` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `surprise_bag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "farm" DROP COLUMN "address",
ADD COLUMN     "apartment" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "street" TEXT;

-- AlterTable
ALTER TABLE "surprise_bag" DROP COLUMN "address",
ADD COLUMN     "apartment" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DECIMAL(65,30),
ADD COLUMN     "longitude" DECIMAL(65,30),
ADD COLUMN     "street" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "apartment" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DECIMAL(65,30),
ADD COLUMN     "longitude" DECIMAL(65,30),
ADD COLUMN     "street" TEXT;
