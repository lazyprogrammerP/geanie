/*
  Warnings:

  - The values [SUMMARISE] on the enum `TaskType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `dataType` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskDataType" AS ENUM ('NUMBER', 'TEXT', 'LIST');

-- AlterEnum
BEGIN;
CREATE TYPE "TaskType_new" AS ENUM ('EXTRACT', 'ClASSSIFY', 'GENERATE');
ALTER TABLE "Task" ALTER COLUMN "type" TYPE "TaskType_new" USING ("type"::text::"TaskType_new");
ALTER TYPE "TaskType" RENAME TO "TaskType_old";
ALTER TYPE "TaskType_new" RENAME TO "TaskType";
DROP TYPE "TaskType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "dataType" "TaskDataType" NOT NULL;
