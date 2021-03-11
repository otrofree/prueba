/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[titulo]` on the table `Libro`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Libro.titulo_unique" ON "Libro"("titulo");
