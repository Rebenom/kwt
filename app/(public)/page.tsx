import Link from 'next/link';
import { Leaf, MessageCircle, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/public/ProductCard';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch active products (max 6)
  const rawProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  // Fetch KWT Profile
  const profile = await prisma.profileContent.findUnique({
    where: { id: 'singleton' },
  });

  const adminPhone = profile?.whatsapp || process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const whatsappUrl = `https://wa.me/${adminPhone.replace(/[+\-\s]/g, '')}?text=${encodeURIComponent(
    'Halo KWT Loh Jinawi 1! Saya berkunjung ke website Anda dan ingin menanyakan produk.'
  )}`;

  // Parse first two sentences of history for preview
  const historyText = profile?.history || '';
  const sentences = historyText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const historyPreview = sentences.length > 0
    ? sentences.slice(0, 2).join('. ') + '.'
    : 'KWT Loh Jinawi 1 dibentuk melalui musyawarah anggota pada 11 Desember 2019 di Desa Kaliurip, Kecamatan Madukara, Kabupaten Banjarnegara. Dilandasi semangat gotong royong dan kemandirian ekonomi wanita desa.';

  return (
    <div className="flex flex-col w-full">
      {/* Section 1 - Hero */}
      <section className="relative bg-gradient-to-br from-[#1a3d0a] to-[#3B6D11] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl flex flex-col gap-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-xs text-primary-lighter rounded-full text-xs font-bold uppercase tracking-wider self-start border border-white/20">
              🌿 P-IRT Bersertifikat · Produk Asli Kaliurip
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Cita Rasa Lokal dari Dapur Ibu-Ibu Kaliurip, Banjarnegara
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl">
              Nikmati kelezatan asli Combro Mocaf - camilan renyah berbahan singkong MOCAF pilihan hasil gotong royong KWT Loh Jinawi 1.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/produk">
                <Button variant="white" size="lg" className="font-semibold shadow-md active:scale-95 hover:bg-gray-100">
                  Lihat Produk Kami
                </Button>
              </Link>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="secondary"
                  icon={<MessageCircle className="w-5 h-5 fill-current" />}
                  className="font-semibold text-white border-white/30 bg-white/10 hover:bg-white/20"
                >
                  Pesan via WhatsApp 💬
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Keunggulan (Grid) */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Keunggulan 1 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-primary-light text-primary rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Bersertifikat P-IRT</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Produk aman konsumsi dengan sertifikat P-IRT No. 2068804011911-26.
                </p>
              </div>
            </div>

            {/* Keunggulan 2 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-primary-light text-primary rounded-xl shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Singkong MOCAF Pilihan</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Bahan singkong pilihan yang terfermentasi menghasilkan tekstur super renyah.
                </p>
              </div>
            </div>

            {/* Keunggulan 3 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-primary-light text-primary rounded-xl shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Kirim ke Seluruh ID</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Jangkauan pengiriman luas hingga daerah Jabodetabek (Jakarta &amp; Tangerang).
                </p>
              </div>
            </div>

            {/* Keunggulan 4 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-primary-light text-primary rounded-xl shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Order via WhatsApp</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Pemesanan mudah terintegrasi langsung dengan WhatsApp Click-to-Chat admin KWT.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Produk Unggulan */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Pilihan Terbaik</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 mt-1">Produk Unggulan Kami</h2>
            </div>
            <Link href="/produk">
              <Button variant="secondary" className="font-bold group active:scale-95">
                Lihat Semua Produk <span className="group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
              </Button>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-150 flex flex-col items-center justify-center text-center shadow-xs">
              <ShoppingBag className="w-16 h-16 text-gray-300 stroke-[1.5] mb-4" />
              <h3 className="text-lg font-bold text-gray-800">Katalog Produk Masih Kosong</h3>
              <p className="text-sm text-gray-500 mt-1">Nantikan olahan pangan berkualitas kami segera!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 4 - Tentang KWT (Preview) */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Placeholder */}
            <div className="lg:col-span-5 relative aspect-video lg:aspect-square bg-gradient-to-tr from-primary-dark to-primary-medium rounded-2xl flex flex-col items-center justify-center text-white p-8 overflow-hidden shadow-md">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
              <Leaf className="w-20 h-20 fill-current mb-4 text-primary-lighter" />
              <span className="text-xl font-extrabold tracking-tight">KWT Loh Jinawi 1</span>
              <span className="text-xs text-primary-light font-semibold mt-1">Desa Kaliurip, Banjarnegara</span>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="text-primary font-bold text-sm uppercase tracking-wider">Profil Kelompok</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 mt-1">KWT Loh Jinawi 1</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">
                {historyPreview}
              </p>
              
              {/* Stat figures */}
              <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6">
                <div>
                  <h4 className="text-3xl font-extrabold text-primary">2019</h4>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Tahun Berdiri</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-primary">30+</h4>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Anggota Aktif</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-primary">P-IRT</h4>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Bersertifikat</p>
                </div>
              </div>

              <div>
                <Link href="/tentang">
                  <Button variant="primary" className="font-semibold active:scale-95">
                    Pelajari Lebih Lanjut &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - CTA WhatsApp */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Tertarik Mencoba Combro Mocaf KWT Loh Jinawi 1?</h2>
          <p className="text-gray-100 text-base max-w-xl leading-relaxed">
            Dapatkan Combro Mocaf renyah dan gurih produksi ibu-ibu tani langsung ke tempat tinggal Anda. Tekan tombol di bawah untuk memesan via WhatsApp.
          </p>
          <div className="pt-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="white"
                size="lg"
                className="hover:bg-gray-100 font-extrabold text-base px-8 py-4 shadow-xl flex items-center gap-2.5 rounded-xl border-none hover:scale-103 active:scale-97 transition-all"
              >
                <MessageCircle className="w-6 h-6 fill-current" />
                Chat WhatsApp Sekarang
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
