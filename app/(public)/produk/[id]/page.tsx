import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Leaf, Info } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import OrderForm from './OrderForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    product = await prisma.product.findUnique({ where: { slug: id } });
  }

  if (!product || !product.isActive) {
    return { title: 'Produk Tidak Ditemukan' };
  }

  return {
    title: `${product.name} - KWT Loh Jinawi 1`,
    description: product.description || `Pesan ${product.name} olahan asli KWT Loh Jinawi 1 Desa Kaliurip, Banjarnegara.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    product = await prisma.product.findUnique({
      where: { slug: id },
    });
  }

  if (!product || !product.isActive) {
    notFound();
  }

  const serializedProduct = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left: Image */}
        <div className="lg:col-span-6">
          <div className="relative aspect-square w-full bg-primary-light rounded-2xl overflow-hidden border border-gray-200 shadow-xs flex items-center justify-center">
            {serializedProduct.imageUrl ? (
              <Image
                src={serializedProduct.imageUrl}
                alt={serializedProduct.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-primary">
                <Leaf className="w-24 h-24 stroke-[1.5] mb-4 text-primary-medium" />
                <span className="text-lg font-bold text-center uppercase tracking-wide">{serializedProduct.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {serializedProduct.certification && (
              <div className="self-start">
                <Badge variant="success" className="bg-primary text-white border-none py-1 px-3">
                  ✓ {serializedProduct.certification}
                </Badge>
              </div>
            )}
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">{serializedProduct.name}</h1>
            <p className="text-sm text-gray-500 font-medium">
              Kemasan {serializedProduct.weight ? `±${serializedProduct.weight} gram` : 'Standard'} / {serializedProduct.unit || 'bungkus'}
            </p>
          </div>

          <div className="flex items-center gap-4 py-2 border-y border-gray-150">
            <span className="text-3xl font-extrabold text-primary">{formatRupiah(serializedProduct.price)}</span>
            {serializedProduct.stock > 0 ? (
              <Badge variant="success">✓ Tersedia ({serializedProduct.stock} {serializedProduct.unit})</Badge>
            ) : (
              <Badge variant="danger">✗ Stok Habis</Badge>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-gray-800 text-sm">Deskripsi Produk</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {serializedProduct.description || 'Tidak ada deskripsi produk.'}
            </p>
          </div>

          {/* Pemesanan Form */}
          <OrderForm product={serializedProduct} />

          {/* Cara Pemesanan */}
          <div className="bg-primary-light/50 border border-primary-lighter rounded-xl p-5 mt-4">
            <h3 className="font-bold text-primary-dark text-sm flex items-center gap-2 mb-3">
              <Info className="w-4.5 h-4.5 shrink-0" />
              Cara Pemesanan
            </h3>
            <ol className="list-decimal list-inside text-xs text-gray-700 flex flex-col gap-2 leading-relaxed">
              <li>Tentukan jumlah pembelian dan klik tombol pemesanan di atas.</li>
              <li>Sistem akan mengalihkan Anda ke WhatsApp Admin KWT dengan pesan terformat otomatis.</li>
              <li>Admin KWT akan mengonfirmasi total biaya, ketersediaan, serta biaya pengiriman.</li>
              <li>Lakukan transfer pembayaran manual sesuai instruksi admin.</li>
              <li>Produk Anda akan dikemas dan dikirimkan (atau siap diambil jika COD).</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
