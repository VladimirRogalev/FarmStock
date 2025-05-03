-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_farmId_fkey";

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "farmId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
