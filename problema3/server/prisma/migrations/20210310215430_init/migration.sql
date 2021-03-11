/*
  Warnings:

  - You are about to drop the column `prestamoId` on the `Libro` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Libro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editorial" TEXT NOT NULL,
    "sinopsis" TEXT,
    "edicion" TEXT NOT NULL
);
INSERT INTO "new_Libro" ("id", "titulo", "autor", "editorial", "sinopsis", "edicion") SELECT "id", "titulo", "autor", "editorial", "sinopsis", "edicion" FROM "Libro";
DROP TABLE "Libro";
ALTER TABLE "new_Libro" RENAME TO "Libro";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
