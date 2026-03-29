const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Check image counts per product
  console.log('Images per product:');
  const products = await p.product.findMany({
    select: { slug: true, _count: { select: { images: true } } },
    orderBy: { slug: 'asc' }
  });
  for (const prod of products) {
    console.log(`  ${prod.slug}: ${prod._count.images} images`);
  }

  // Check reviews
  console.log('\nReviews per product:');
  const reviews = await p.review.findMany({
    select: { product: { select: { slug: true } }, rating: true, title: true },
    orderBy: { productId: 'asc' }
  });
  for (const r of reviews) {
    console.log(`  ${r.product.slug}: ${r.rating}★ "${r.title}"`);
  }

  // Check order items
  console.log('\nOrder items:');
  const items = await p.orderItem.findMany({
    select: { productName: true, quantity: true, unitPrice: true, order: { select: { orderNumber: true } } }
  });
  for (const item of items) {
    console.log(`  ${item.order.orderNumber}: ${item.productName} x${item.quantity} @ ${item.unitPrice}`);
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
