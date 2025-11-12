-- CreateIndex
CREATE INDEX "one_time_token_secrets_user_id_idx" ON "one_time_token_secrets"("user_id");

-- CreateIndex
CREATE INDEX "saved_recommendations_user_id_idx" ON "saved_recommendations"("user_id");

-- AddForeignKey
ALTER TABLE "saved_recommendations" ADD CONSTRAINT "saved_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "one_time_token_secrets" ADD CONSTRAINT "one_time_token_secrets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
