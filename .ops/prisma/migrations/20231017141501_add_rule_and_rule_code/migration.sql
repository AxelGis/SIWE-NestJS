-- CreateTable
CREATE TABLE `Rule` (
    `ruleId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    UNIQUE INDEX `Rule_name_key`(`name`),
    PRIMARY KEY (`ruleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RuleCode` (
    `ruleCodeId` INTEGER NOT NULL AUTO_INCREMENT,
    `ruleId` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    UNIQUE INDEX `RuleCode_ruleCodeId_version_key`(`ruleCodeId`, `version`),
    PRIMARY KEY (`ruleCodeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RuleCode` ADD CONSTRAINT `RuleCode_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `Rule`(`ruleId`) ON DELETE RESTRICT ON UPDATE CASCADE;
