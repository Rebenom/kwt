import { Leaf, MapPin, MessageCircle, Star, Calendar, Users, Award } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tentang Kami',
  description: 'Profil Lengkap, Sejarah, Visi, Misi, dan Struktur Organisasi Kelompok Wanita Tani Loh Jinawi 1 Desa Kaliurip, Banjarnegara.',
};

export default async function AboutPage() {
  const profile = await prisma.profileContent.findUnique({
    where: { id: 'singleton' },
  });

  const members = await prisma.organizationMember.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const management = members.filter((m) => m.isManagement);
  const sections = members.filter((m) => !m.isManagement);

  const missions = Array.isArray(profile?.missions)
    ? (profile.missions as string[])
    : [
        'Meningkatkan keterampilan anggota dalam pengolahan produk pangan lokal',
        'Menghasilkan produk pangan higienis dan bersertifikasi sesuai standar keamanan pangan',
        'Memperluas jangkauan pemasaran melalui platform digital',
        'Mendorong kemandirian ekonomi anggota melalui pengelolaan keuangan yang transparan',
        'Memperkuat solidaritas dan kerjasama antar anggota',
      ];

  const adminPhone = profile?.whatsapp || process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const whatsappUrl = `https://wa.me/${adminPhone.replace(/[+\-\s]/g, '')}?text=${encodeURIComponent(
    'Halo KWT Loh Jinawi 1! Saya ingin menanyakan profil kelompok.'
  )}`;

  const getInitials = (name: string) => {
    // Strip titles and brackets like "(Kepala Desa)"
    const cleanName = name.replace(/\([^)]*\)/g, '').trim();
    return cleanName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Section 1 - Hero */}
      <section className="bg-gradient-to-br from-[#1a3d0a] to-[#27500A] text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kelompok Wanita Tani Loh Jinawi 1</h1>
          <p className="text-sm md:text-base text-primary-lighter mt-2 font-semibold">
            Desa Kaliurip, Kecamatan Madukara, Kabupaten Banjarnegara
          </p>

          {/* Grid facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10 border-t border-white/10 pt-8">
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl backdrop-blur-xs">
              <Calendar className="w-6 h-6 text-primary-lighter mb-2" />
              <span className="text-xl font-bold">2019</span>
              <span className="text-xxs text-gray-300 font-medium uppercase mt-1">Berdiri sejak</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl backdrop-blur-xs">
              <Users className="w-6 h-6 text-primary-lighter mb-2" />
              <span className="text-xl font-bold">30+</span>
              <span className="text-xxs text-gray-300 font-medium uppercase mt-1">Anggota Tani</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl backdrop-blur-xs">
              <Leaf className="w-6 h-6 text-primary-lighter mb-2" />
              <span className="text-xl font-bold">1 Unggulan</span>
              <span className="text-xxs text-gray-300 font-medium uppercase mt-1">Combro Mocaf</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl backdrop-blur-xs">
              <Award className="w-6 h-6 text-primary-lighter mb-2" />
              <span className="text-xl font-bold">P-IRT</span>
              <span className="text-xxs text-gray-300 font-medium uppercase mt-1">Sertifikasi Resmi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Sejarah */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <div className="text-center">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Perjalanan Kami</span>
            <h2 className="text-3xl font-extrabold text-gray-950 mt-1">Sejarah Kelompok</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-base whitespace-pre-wrap">
            {profile?.history ||
              'KWT Loh Jinawi 1 dibentuk melalui musyawarah anggota pada 11 Desember 2019 di Desa Kaliurip, Kecamatan Madukara, Kabupaten Banjarnegara. Dilandasi semangat gotong royong dan kemandirian ekonomi wanita desa, dengan dukungan penuh perangkat Desa Kaliurip. Sejak awal berdiri terus bertransformasi, kini aktif memproduksi combro mocaf dengan jangkauan pasar hingga Jakarta dan Tangerang.'}
          </p>

          <div className="bg-primary-light border-l-4 border-primary rounded-r-xl p-5 mt-4 flex items-center gap-4">
            <Calendar className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="font-bold text-primary-dark text-sm">Dibentuk Melalui Musyawarah</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                KWT Loh Jinawi 1 resmi didirikan pada tanggal <strong className="text-gray-800">{profile?.foundedDate || '11 Desember 2019'}</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Visi & Misi */}
      <section className="py-16 bg-gray-50 border-y border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
            {/* Visi */}
            <div className="lg:col-span-5 bg-primary-light border border-primary-lighter rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="p-3 bg-white text-primary rounded-xl inline-block shadow-xs mb-6">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <h3 className="text-2xl font-extrabold text-primary-dark">Visi Kelompok</h3>
                <p className="text-gray-700 leading-relaxed text-base mt-4 italic">
                  &ldquo;{profile?.vision || 'Menjadi kelompok wanita tani yang mandiri dan produktif dalam menghasilkan produk pangan lokal berkualitas tinggi untuk kesejahteraan anggota dan masyarakat Desa Kaliurip.'}&rdquo;
                </p>
              </div>
              <div className="text-xs text-primary/70 font-semibold tracking-wide uppercase mt-8">
                KWT Loh Jinawi 1 &bull; Kaliurip
              </div>
            </div>

            {/* Misi */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col gap-6">
              <h3 className="text-2xl font-extrabold text-gray-950">Misi Kelompok</h3>
              <ul className="flex flex-col gap-4 text-sm text-gray-600">
                {missions.map((mission, idx) => (
                  <li key={idx} className="flex gap-3.5 items-start">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-light text-primary font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{mission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Struktur Organisasi */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Struktur Kepengurusan</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 mt-1">Susunan Organisasi KWT</h2>
            <p className="text-xs text-gray-500 mt-2">
              Berdasarkan hasil musyawarah anggota dan dukungan perangkat Desa Kaliurip.
            </p>
          </div>

          {/* Jajaran Pengurus Inti */}
          <div className="mb-16">
            <h3 className="text-center font-bold text-gray-800 text-lg uppercase tracking-wide mb-8">
              Pengurus Inti
            </h3>
            {management.length === 0 ? (
              <p className="text-center text-sm text-gray-500">Belum ada data pengurus inti.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {management.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col items-center p-6 text-center border-t-4 border-primary"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                      {getInitials(member.name)}
                    </div>
                    <h4 className="font-bold text-gray-900 text-base leading-snug">{member.name}</h4>
                    <span className="text-xs text-primary font-semibold tracking-wide uppercase mt-1">
                      {member.position}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Jajaran Kepala Seksi */}
          <div>
            <h3 className="text-center font-bold text-gray-800 text-lg uppercase tracking-wide mb-8">
              Kepala Seksi Kerja
            </h3>
            {sections.length === 0 ? (
              <p className="text-center text-sm text-gray-500">Belum ada data kepala seksi.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {sections.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gray-50 rounded-xl border border-gray-200 p-5 text-center flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm mb-3">
                      {getInitials(member.name)}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{member.name}</h4>
                    <span className="inline-block px-2.5 py-0.5 bg-white text-xxs text-primary border border-primary-lighter rounded-full font-semibold uppercase mt-2">
                      {member.section || member.position}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 5 - Kontak */}
      <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-150">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center gap-6">
            <div className="p-4 bg-primary-light text-primary rounded-full">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-950">Hubungi &amp; Kunjungi Kami</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
                Silakan kunjungi sekretariat kami di Desa Kaliurip atau hubungi admin pemesanan via chat WhatsApp.
              </p>
            </div>

            <div className="flex flex-col gap-3 my-4">
              <div className="text-sm text-gray-700 leading-relaxed font-medium max-w-xl">
                📍 {profile?.address || 'Jln. Raya Kaliurip-Pakelen, RT 04/RW 02, Desa Kaliurip, Kecamatan Madukara, Kabupaten Banjarnegara'}
              </div>
              <div className="text-sm text-primary font-bold">
                📞 +{adminPhone}
              </div>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                icon={<MessageCircle className="w-5 h-5 fill-current" />}
                className="font-extrabold px-8 shadow-sm rounded-xl py-3.5"
              >
                Chat via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
