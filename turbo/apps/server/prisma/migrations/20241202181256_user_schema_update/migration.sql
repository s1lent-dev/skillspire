-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "firstName" SET DEFAULT 'skillspire',
ALTER COLUMN "lastName" SET DEFAULT 'user',
ALTER COLUMN "displayName" SET DEFAULT 'skillspire user';
