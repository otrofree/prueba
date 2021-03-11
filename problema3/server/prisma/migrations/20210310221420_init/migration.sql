/*
  Warnings:

  - You are about to drop the `Post2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `rol` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User2.email_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post2";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User2";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Libro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "editorial" TEXT NOT NULL,
    "sinopsis" TEXT,
    "edicion" TEXT,
    "prestamoId" INTEGER,
    FOREIGN KEY ("prestamoId") REFERENCES "Prestamo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Libro" ("id", "titulo", "autor", "editorial", "sinopsis", "edicion") SELECT "id", "titulo", "autor", "editorial", "sinopsis", "edicion" FROM "Libro";
DROP TABLE "Libro";
ALTER TABLE "new_Libro" RENAME TO "Libro";
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "clave" TEXT NOT NULL,
    "activo" INTEGER NOT NULL DEFAULT 0,
    "role" INTEGER NOT NULL DEFAULT 3
);
INSERT INTO "new_Usuario" ("id", "email", "name", "clave", "activo") SELECT "id", "email", "name", "clave", "activo" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario.email_unique" ON "Usuario"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
