'use client';

import React, { useState } from 'react';
import { Search, PackageX } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/public/ProductCard';
import { Button } from '@/components/ui/Button';

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = initialProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950">Katalog Produk</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Temukan camilan renyah dan produk pangan lokal berkualitas tinggi olahan Kelompok Wanita Tani Loh Jinawi 1.
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
          />
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2 pl-1">
            Menampilkan hasil untuk &ldquo;{searchQuery}&rdquo; &middot; {filteredProducts.length} produk ditemukan
          </p>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-gray-200 flex flex-col items-center justify-center text-center shadow-xs max-w-lg mx-auto">
          <PackageX className="w-16 h-16 text-gray-300 stroke-[1.5] mb-4" />
          <h3 className="text-lg font-bold text-gray-800">Produk Tidak Ditemukan</h3>
          <p className="text-sm text-gray-500 mt-1">Coba masukkan kata kunci pencarian yang lain.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="mt-4 font-semibold"
          >
            Reset Pencarian
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
