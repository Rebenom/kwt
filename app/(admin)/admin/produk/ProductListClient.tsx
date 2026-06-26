'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Leaf, Edit, Power } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ProductListClientProps {
  initialProducts: Product[];
}

export default function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const actionText = currentStatus ? 'menonaktifkan' : 'mengaktifkan';
    const confirmation = confirm(`Apakah Anda yakin ingin ${actionText} produk ini?`);
    if (!confirmation) return;

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/produk/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error('Gagal memperbarui status produk.');
      }

      const { product: updated } = await res.json();
      setProducts(
        products.map((p) => (p.id === id ? { ...updated, price: Number(updated.price) } : p))
      );
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight">Manajemen Produk</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar semua produk katalog KWT Loh Jinawi 1.</p>
        </div>
        <Link href="/admin/produk/tambah">
          <Button icon={<Plus className="w-4 h-4" />} className="font-bold">
            Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="max-w-md">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card variant="default" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase">
                <th className="px-6 py-4">Gambar</th>
                <th className="px-6 py-4">Nama &amp; Slug</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4 text-center">Stok</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Tidak ada produk yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 bg-primary-light rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                        ) : (
                          <Leaf className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 block">{p.name}</span>
                      <span className="text-xxs text-gray-400 font-mono block mt-0.5">{p.slug}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{formatRupiah(p.price)}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-800">
                      {p.stock} {p.unit || 'bungkus'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!p.isActive ? (
                        <Badge variant="neutral">Nonaktif</Badge>
                      ) : p.stock <= 0 ? (
                        <Badge variant="danger">Stok Habis</Badge>
                      ) : (
                        <Badge variant="success">Aktif</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3.5">
                        <Link
                          href={`/admin/produk/${p.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleToggleActive(p.id, p.isActive)}
                          disabled={updatingId === p.id}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{p.isActive ? 'Nonaktifkan' : 'Aktifkan'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
