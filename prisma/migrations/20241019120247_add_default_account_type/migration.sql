/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "account_type" TEXT NOT NULL DEFAULT 'Individual',
ADD COLUMN     "business_name" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "office_address" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "reg_number" TEXT,
ADD COLUMN     "sc_number" TEXT;
