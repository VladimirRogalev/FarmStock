/*
  Warnings:

  - You are about to drop the column `availability_end` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `availability_start` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `discountPercentage` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `_CompletedOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NotPickedOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReservedOrders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityEnd` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityStart` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPercentage` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmId` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CompletedOrders" DROP CONSTRAINT "_CompletedOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompletedOrders" DROP CONSTRAINT "_CompletedOrders_B_fkey";

-- DropForeignKey
ALTER TABLE "_NotPickedOrders" DROP CONSTRAINT "_NotPickedOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_NotPickedOrders" DROP CONSTRAINT "_NotPickedOrders_B_fkey";

-- DropForeignKey
ALTER TABLE "_ReservedOrders" DROP CONSTRAINT "_ReservedOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReservedOrders" DROP CONSTRAINT "_ReservedOrders_B_fkey";

-- DropIndex
DROP INDEX "order_farmId_key";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "availability_end",
DROP COLUMN "availability_start",
DROP COLUMN "discountPercentage",
DROP COLUMN "price",
DROP COLUMN "quantity",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_item" ADD COLUMN     "availabilityEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "availabilityStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "discountPercentage" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "farmId" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- DropTable
DROP TABLE "_CompletedOrders";

-- DropTable
DROP TABLE "_NotPickedOrders";

-- DropTable
DROP TABLE "_ReservedOrders";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
