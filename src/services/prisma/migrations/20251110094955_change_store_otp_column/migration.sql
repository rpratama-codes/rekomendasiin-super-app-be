/*
  Warnings:

  - You are about to drop the column `algorithm` on the `one_time_token_secrets` table. All the data in the column will be lost.
  - Added the required column `config` to the `one_time_token_secrets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "one_time_token_secrets" DROP COLUMN "algorithm",
ADD COLUMN     "config" JSONB NOT NULL;
