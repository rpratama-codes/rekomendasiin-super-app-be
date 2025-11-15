-- AlterTable
ALTER TABLE "user" ADD COLUMN     "google_account_id" TEXT;

-- CreateIndex
CREATE INDEX "user_google_account_id_idx" ON "user"("google_account_id");
