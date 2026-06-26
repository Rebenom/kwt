import React from 'react';
import Link from 'next/link';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const whatsappUrl = `https://wa.me/${adminPhone.replace(/[+\-\s]/g, '')}?text=${encodeURIComponent('Halo KWT Loh Jinawi 1!')}`;

  return (
    <footer className="bg-[#1a3d0a] text-gray-200 border-t border-[#254f15]">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Column 1: Info & Tagline */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="p-1.5 bg-[#254f15] rounded-lg text-primary-lighter">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <span>KWT Loh Jinawi 1</span>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Produk Pangan Lokal Berkualitas dari Kaliurip, Banjarnegara. Mengolah singkong fermentasi MOCAF menjadi Combro Mocaf renyah dan gurih.
            </p>
            <div className="mt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-lighter hover:text-white transition-colors"
              >
                Hubungi Kami via WhatsApp &rarr;
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4 md:pl-12">
            <h4 className="text-white font-bold text-base tracking-wider uppercase">Navigasi</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-primary-lighter transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:text-primary-lighter transition-colors">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-primary-lighter transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-base tracking-wider uppercase">Kontak Kami</h4>
            <ul className="flex flex-col gap-3.5 text-sm text-gray-300">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-primary-lighter shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Jln. Raya Kaliurip-Pakelen, RT 04/RW 02, Desa Kaliurip, Kecamatan Madukara, Kabupaten Banjarnegara, Jawa Tengah
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-primary-lighter shrink-0" />
                <span>+{adminPhone}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-primary-lighter shrink-0" />
                <span>kwtlohjinawi1@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#102706] py-6 border-t border-[#1a3d0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            &copy; 2026 KWT Loh Jinawi 1. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="text-xs text-gray-500 text-center sm:text-right">
            Desa Kaliurip, Madukara, Banjarnegara
          </p>
        </div>
      </div>
    </footer>
  );
};
