/*
  Warnings:

  - The values [AVAILABLE,RESERVED,FULFILLED,EXPIRED] on the enum `EnumOrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnumOrderStatus_new" AS ENUM ('PENDING', 'PAID', 'CANCELLED');
ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "order" ALTER COLUMN "status" TYPE "EnumOrderStatus_new" USING ("status"::text::"EnumOrderStatus_new");
ALTER TYPE "EnumOrderStatus" RENAME TO "EnumOrderStatus_old";
ALTER TYPE "EnumOrderStatus_new" RENAME TO "EnumOrderStatus";
DROP TYPE "EnumOrderStatus_old";
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
