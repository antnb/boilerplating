/*
  Warnings:

  - You are about to drop the column `expertId` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `expertId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `experts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorProfileId` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_expertId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_expertId_fkey`;

-- AlterTable
ALTER TABLE `articles` DROP COLUMN `expertId`,
    ADD COLUMN `authorProfileId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `expertId`,
    ADD COLUMN `curatorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `role`,
    ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 5;

-- DropTable
DROP TABLE `experts`;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `label` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(50) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `bio` TEXT NOT NULL,
    `avatar` VARCHAR(500) NULL,
    `badge` VARCHAR(50) NULL,
    `verificationNote` TEXT NULL,
    `staffRole` VARCHAR(30) NOT NULL,
    `isTeamVisible` BOOLEAN NOT NULL DEFAULT true,
    `teamSortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `staff_profiles_isTeamVisible_teamSortOrder_idx`(`isTeamVisible`, `teamSortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `users_roleId_idx` ON `users`(`roleId`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_curatorId_fkey` FOREIGN KEY (`curatorId`) REFERENCES `staff_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff_profiles` ADD CONSTRAINT `staff_profiles_id_fkey` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_authorProfileId_fkey` FOREIGN KEY (`authorProfileId`) REFERENCES `staff_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
