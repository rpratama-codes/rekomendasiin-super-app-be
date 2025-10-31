/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "picture" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "category_name" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "category_id" TEXT,
    "item_name" TEXT,
    "soc" DOUBLE PRECISION,
    "ram" DOUBLE PRECISION,
    "rom" DOUBLE PRECISION,
    "camera" DOUBLE PRECISION,
    "screen" DOUBLE PRECISION,
    "nfc" DOUBLE PRECISION,
    "network" DOUBLE PRECISION,
    "battery" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "picture" TEXT,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criteria" (
    "id" TEXT NOT NULL,
    "category_id" TEXT,
    "criteria_name" TEXT NOT NULL,
    "soc" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ram" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "camera" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "screen" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nfc" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "network" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "battery" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "criteria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria" ADD CONSTRAINT "criteria_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
