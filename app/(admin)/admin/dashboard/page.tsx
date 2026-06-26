import Link from 'next/link';
import { Package, PackageX, AlertTriangle, Plus, Edit, ExternalLink, Phone } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatRupiah } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Dashboard Admin',
};

export default async function DashboardPage() {
  // Query statistics
  const totalActive = await prisma.product.count({
    where: { isActive: true },
  });

  const lowStock = await prisma.product.count({
    where: {
      isActive: true,
      stock: {
        gt: 0,
        lt: 5,
      },
    },
  });

  const totalInactive = await prisma.product.count({
    where: { isActive: false },
  });

  // Fetch recent 5 products
  const rawRecentProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const recentProducts = rawRecentProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  // Fetch profile content for WhatsApp number details
  const profile = await prisma.profileContent.findUnique({
    where: { id: 'singleton' },
  });

  const adminPhone = profile?.whatsapp || process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight">Ringkasan Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Selamat datang kembali di panel administrator KWT Loh Jinawi 1.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/produk/tambah">
            <Button size="sm" icon={<Plus className="w-4 h-4" />} className="font-bold">
              Tambah Produk
            </Button>
          </Link>
          <Link href="/admin/profil">
            <Button size="sm" variant="secondary" icon={<Edit className="w-4 h-4" />} className="font-bold">
              Edit Profil KWT
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card variant="default" className="p-6 flex items-center gap-5">
          <div className="p-4 bg-green-50 text-primary rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Produk Aktif</span>
            <h3 className="text-3xl font-black text-gray-900 mt-0.5">{totalActive}</h3>
          </div>
        </Card>

        <Card variant="default" className="p-6 flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Stok Menipis</span>
            <h3 className="text-3xl font-black text-gray-900 mt-0.5">{lowStock}</h3>
          </div>
        </Card>

        <Card variant="default" className="p-6 flex items-center gap-5">
          <div className="p-4 bg-gray-50 text-gray-500 rounded-2xl">
            <PackageX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Produk Nonaktif</span>
            <h3 className="text-3xl font-black text-gray-900 mt-0.5">{totalInactive}</h3>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table of recent products */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 text-base">Produk Terbaru</h3>
          <Card variant="default" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase">
                    <th className="px-6 py-4">Nama Produk</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4 text-center">Stok</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Belum ada data produk.
                      </td>
                    </tr>
                  ) : (
                    recentProducts.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 block">{p.name}</span>
                          <span className="text-xxs text-gray-400 font-mono block mt-0.5">{p.slug}</span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{formatRupiah(p.price)}</td>
                        <td className="px-6 py-4 text-center">
                          {p.stock <= 0 ? (
                            <span className="text-red-600 font-bold">0</span>
                          ) : (
                            <span className="text-gray-950 font-medium">{p.stock}</span>
                          )}
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
                          <Link
                            href={`/admin/produk/${p.id}/edit`}
                            className="text-xs font-bold text-primary hover:text-primary-dark hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Info */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 text-base">Info Sistem &amp; Kontak</h3>
          <Card variant="default" className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5 pb-4 border-b border-gray-100">
              <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">Nomor WhatsApp Aktif</span>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Phone className="w-4.5 h-4.5 shrink-0" />
                <span>+{adminPhone}</span>
              </div>
              <p className="text-xxs text-gray-400 mt-1">Pemesanan WhatsApp Click-to-Chat dialihkan ke nomor ini.</p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">Website Publik</span>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
              >
                <span>Lihat Website Publik</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
