/*
  Warnings:

  - You are about to drop the column `responsable` on the `Tarea` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT,
    "categoria" TEXT,
    "deadline" DATETIME,
    "prioridad" INTEGER,
    "idUsuario" INTEGER NOT NULL,
    CONSTRAINT "Tarea_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tarea" ("categoria", "deadline", "descripcion", "estado", "id", "idUsuario", "nombre", "prioridad") SELECT "categoria", "deadline", "descripcion", "estado", "id", "idUsuario", "nombre", "prioridad" FROM "Tarea";
DROP TABLE "Tarea";
ALTER TABLE "new_Tarea" RENAME TO "Tarea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
