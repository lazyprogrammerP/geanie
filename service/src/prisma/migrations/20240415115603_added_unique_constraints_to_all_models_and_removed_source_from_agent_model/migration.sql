/*
  Warnings:

  - You are about to drop the column `source` on the `Agent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,name]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[agentId,key]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "source";

-- CreateIndex
CREATE UNIQUE INDEX "Agent_projectId_name_key" ON "Agent"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Task_agentId_key_key" ON "Task"("agentId", "key");
