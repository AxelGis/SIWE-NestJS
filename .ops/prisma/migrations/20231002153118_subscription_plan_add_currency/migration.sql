-- AlterTable
ALTER TABLE `SubscriptionPlan` ADD COLUMN `currency` ENUM('USDT') NOT NULL DEFAULT 'USDT',
    MODIFY `basePrice` DECIMAL(65, 30) NOT NULL;
