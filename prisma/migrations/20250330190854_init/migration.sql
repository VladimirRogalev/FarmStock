-- CreateEnum
CREATE TYPE "EnumUserRoles" AS ENUM ('CUSTOMER', 'FARMER', 'GUEST', 'ADMIN');

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "firstName" TEXT NOT NULL DEFAULT 'not specified',
    "lastName" TEXT NOT NULL DEFAULT 'not specified',
    "phoneNumber" INTEGER NOT NULL,
    "role" "EnumUserRoles" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");
