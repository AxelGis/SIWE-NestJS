/*
  Warnings:

  - You are about to alter the column `name` on the `SubscriptionPeriod` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `name` on the `SubscriptionPlan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `SubscriptionPeriod` MODIFY `name` ENUM('monthly', 'yearly') NOT NULL;

-- AlterTable
ALTER TABLE `SubscriptionPlan` MODIFY `name` ENUM('basic', 'premium', 'ultimate') NOT NULL,
    MODIFY `features` JSON NULL;
