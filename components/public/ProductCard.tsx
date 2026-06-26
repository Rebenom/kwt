import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative aspect-square w-full bg-primary-light flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-primary">
            <Leaf className="w-12 h-12 stroke-[1.5] mb-2 text-primary-medium" />
            <span className="text-xs font-semibold text-center uppercase tracking-wider">{product.name}</span>
          </div>
        )}

        {/* Badges */}
        {product.certification && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant="success" className="bg-primary hover:bg-primary text-white border-none py-1 px-2.5 shadow-xs font-semibold">
              ✓ P-IRT
            </Badge>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Badge variant="danger" className="text-xs py-1.5 px-3.5 shadow-md font-bold uppercase tracking-wider">
              Stok Habis
            </Badge>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-gray-900 font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-xs text-gray-500 mt-1">
          {product.weight ? `±${product.weight}g` : 'Kemasan'} / {product.unit || 'bungkus'}
        </p>

        <div className="mt-auto pt-3">
          <span className="text-primary font-extrabold text-lg">
            {formatRupiah(product.price)}
          </span>
        </div>
      </div>

      {/* Action Button Link */}
      <div className="px-4 pb-4">
        <Link
          href={`/produk/${product.slug}`}
          className="w-full inline-flex items-center justify-center gap-1 bg-primary text-white font-semibold text-sm py-2 px-4 rounded-lg hover:bg-primary-dark transition-all"
        >
          Lihat Detail &amp; Pesan &rarr;
        </Link>
      </div>
    </div>
  );
};
