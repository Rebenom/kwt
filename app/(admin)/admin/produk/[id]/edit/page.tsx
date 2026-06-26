import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditProductForm from './EditProductForm';

export const metadata = {
  title: 'Edit Produk - Admin KWT',
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const serializedProduct = {
    ...product,
    price: Number(product.price),
  };

  return <EditProductForm product={serializedProduct} />;
}
