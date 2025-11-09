/*
  Warnings:

  - You are about to drop the `SavedRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `criteria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('system_user', 'user');

-- DropForeignKey
ALTER TABLE "criteria" DROP CONSTRAINT "criteria_category_id_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_category_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRoles" NOT NULL;

-- DropTable
DROP TABLE "SavedRecommendation";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "criteria";

-- DropTable
DROP TABLE "item";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "category_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criterias" (
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criterias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_recommendations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "visibility" "SavedRecommendationVisibility" NOT NULL DEFAULT 'public',
    "results" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "one_time_token_secrets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "time_used" INTEGER NOT NULL DEFAULT 0,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "one_time_token_secrets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criterias" ADD CONSTRAINT "criterias_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
