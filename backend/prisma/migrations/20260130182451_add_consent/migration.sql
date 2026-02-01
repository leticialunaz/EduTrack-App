-- AlterTable
ALTER TABLE "User" ADD COLUMN     "consentAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentAt" TIMESTAMP(3);
