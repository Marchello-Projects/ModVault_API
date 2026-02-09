/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Mod` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Mod_title_key" ON "Mod"("title");
