-- CreateEnum
CREATE TYPE "SavedRecommendationVisibility" AS ENUM ('private', 'public', 'limited');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SavedRecommendation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "visibility" "SavedRecommendationVisibility" NOT NULL DEFAULT 'public',

    CONSTRAINT "SavedRecommendation_pkey" PRIMARY KEY ("id")
);
