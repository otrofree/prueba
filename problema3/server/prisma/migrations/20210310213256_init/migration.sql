/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prestamoId` to the `Libro` table without a default value. This is not possible if the table is not empty.
  - Made the column `titulo` on table `Libro` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `author` on table `Libro` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `editorial` on table `Libro` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `edicion` on table `Libro` required. The migration will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User.email_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Post2" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER,
    FOREIGN KEY ("authorId") REFERENCES "User2" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User2" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "clave" TEXT NOT NULL,
    "activo" INTEGER NOT NULL,
    "rol" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "estado" INTEGER NOT NULL,
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Libro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "editorial" TEXT NOT NULL,
    "sinopsis" TEXT,
    "edicion" TEXT NOT NULL,
    "prestamoId" INTEGER NOT NULL,
    FOREIGN KEY ("prestamoId") REFERENCES "Prestamo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Libro" ("id", "titulo", "author", "editorial", "sinopsis", "edicion") SELECT "id", "titulo", "author", "editorial", "sinopsis", "edicion" FROM "Libro";
DROP TABLE "Libro";
ALTER TABLE "new_Libro" RENAME TO "Libro";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User2.email_unique" ON "User2"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario.email_unique" ON "Usuario"("email");
