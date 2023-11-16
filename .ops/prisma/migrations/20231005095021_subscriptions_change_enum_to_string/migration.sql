/*
  Warnings:

  - You are about to alter the column `name` on the `SubscriptionPeriod` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - You are about to alter the column `name` on the `SubscriptionPlan` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - A unique constraint covering the columns `[name]` on the table `SubscriptionPeriod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `SubscriptionPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `SubscriptionPeriod` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SubscriptionPlan` MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SubscriptionPeriod_name_key` ON `SubscriptionPeriod`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `SubscriptionPlan_name_key` ON `SubscriptionPlan`(`name`);
