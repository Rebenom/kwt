import { prisma } from '@/lib/prisma';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Katalog Produk',
  description: 'Temukan produk-produk olahan lokal berkualitas tinggi dari Kelompok Wanita Tani Loh Jinawi 1 Desa Kaliurip.',
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return <ProductsClient initialProducts={serializedProducts} />;
}
