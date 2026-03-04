/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "ApiRun" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "host" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "upstreamStatus" INTEGER,
    "ok" BOOLEAN NOT NULL,
    "durationMs" INTEGER,
    "error" TEXT,
    "responsePreview" TEXT,

    CONSTRAINT "ApiRun_pkey" PRIMARY KEY ("id")
);
