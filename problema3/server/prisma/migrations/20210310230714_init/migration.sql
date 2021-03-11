/*
  Warnings:

  - The migration will change the primary key for the `Libro` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `prestamoId` on the `Libro` table. All the data in the column will be lost.
  - The migration will change the primary key for the `Prestamo` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Prestamo` table. All the data in the column will be lost.
  - The migration will change the primary key for the `Usuario` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `libroId` to the `Prestamo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Libro_prestamoId_unique";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Libro" (
    "libroId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editorial" TEXT NOT NULL,
    "sinopsis" TEXT,
    "edicion" TEXT
);
INSERT INTO "new_Libro" ("titulo", "autor", "editorial", "sinopsis", "edicion") SELECT "titulo", "autor", "editorial", "sinopsis", "edicion" FROM "Libro";
DROP TABLE "Libro";
ALTER TABLE "new_Libro" RENAME TO "Libro";
CREATE UNIQUE INDEX "Libro.titulo_unique" ON "Libro"("titulo");
CREATE TABLE "new_Prestamo" (
    "prestamoId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "libroId" INTEGER NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 0,
    "fPrestado" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fEntregaEstimada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fEntregaReal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("usuarioId") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("libroId") REFERENCES "Libro" ("libroId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Prestamo" ("usuarioId", "estado") SELECT "usuarioId", "estado" FROM "Prestamo";
DROP TABLE "Prestamo";
ALTER TABLE "new_Prestamo" RENAME TO "Prestamo";
CREATE UNIQUE INDEX "Prestamo_libroId_unique" ON "Prestamo"("libroId");
CREATE TABLE "new_Usuario" (
    "usuarioId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "clave" TEXT NOT NULL,
    "activo" INTEGER NOT NULL DEFAULT 0,
    "role" INTEGER NOT NULL DEFAULT 3
);
INSERT INTO "new_Usuario" ("email", "name", "clave", "activo", "role") SELECT "email", "name", "clave", "activo", "role" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario.email_unique" ON "Usuario"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
