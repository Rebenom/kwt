import { prisma } from '@/lib/prisma';
import ProductListClient from './ProductListClient';

export const metadata = {
  title: 'Daftar Produk - Admin KWT',
};

export default async function ProductAdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return <ProductListClient initialProducts={serializedProducts} />;
}
