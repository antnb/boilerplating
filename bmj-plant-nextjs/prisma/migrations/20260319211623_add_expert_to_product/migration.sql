-- AlterTable
ALTER TABLE `products` ADD COLUMN `expertId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_expertId_fkey` FOREIGN KEY (`expertId`) REFERENCES `experts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
