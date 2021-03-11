/*
  Warnings:

  - You are about to drop the column `author` on the `Libro` table. All the data in the column will be lost.
  - Added the required column `autor` to the `Libro` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Libro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editorial" TEXT NOT NULL,
    "sinopsis" TEXT,
    "edicion" TEXT NOT NULL,
    "prestamoId" INTEGER NOT NULL,
    FOREIGN KEY ("prestamoId") REFERENCES "Prestamo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Libro" ("id", "titulo", "editorial", "sinopsis", "edicion", "prestamoId") SELECT "id", "titulo", "editorial", "sinopsis", "edicion", "prestamoId" FROM "Libro";
DROP TABLE "Libro";
ALTER TABLE "new_Libro" RENAME TO "Libro";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
