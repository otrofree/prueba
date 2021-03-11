/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[prestamoId]` on the table `Libro`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Libro_prestamoId_unique" ON "Libro"("prestamoId");
