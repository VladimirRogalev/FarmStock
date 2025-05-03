/*
  Warnings:

  - Added the required column `total` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "total" DECIMAL(65,30) NOT NULL;
