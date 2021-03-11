/*
  Warnings:

  - You are about to drop the column `role` on the `Usuario` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "usuarioId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nombre" TEXT,
    "clave" TEXT NOT NULL,
    "activo" INTEGER NOT NULL DEFAULT 0,
    "rol" INTEGER NOT NULL DEFAULT 2
);
INSERT INTO "new_Usuario" ("usuarioId", "email", "nombre", "clave", "activo") SELECT "usuarioId", "email", "nombre", "clave", "activo" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario.email_unique" ON "Usuario"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
