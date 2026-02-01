/*
  Warnings:

  - Made the column `status` on table `StudentGrade` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StudentGrade" ALTER COLUMN "status" SET NOT NULL;
