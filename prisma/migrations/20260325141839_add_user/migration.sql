/*
  Warnings:

  - Added the required column `idUsuario` to the `Tarea` table without a default value. This is not possible if the table is not empty.

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
    "responsable" TEXT,
    "deadline" DATETIME,
    "prioridad" INTEGER,
    "idUsuario" INTEGER NOT NULL,
    CONSTRAINT "Tarea_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tarea" ("categoria", "deadline", "descripcion", "estado", "id", "nombre", "prioridad", "responsable") SELECT "categoria", "deadline", "descripcion", "estado", "id", "nombre", "prioridad", "responsable" FROM "Tarea";
DROP TABLE "Tarea";
ALTER TABLE "new_Tarea" RENAME TO "Tarea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
