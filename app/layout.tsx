import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'KWT Loh Jinawi 1 - Combro Mocaf Desa Kaliurip',
    template: '%s | KWT Loh Jinawi 1',
  },
  description: 'Sistem Penjualan Resmi Kelompok Wanita Tani (KWT) Loh Jinawi 1 Desa Kaliurip, Madukara, Banjarnegara. Nikmati kelezatan olahan Combro Singkong MOCAF asli.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
