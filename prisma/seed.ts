import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products...');
  // Seed Product
  await prisma.product.upsert({
    where: { slug: 'combro-mocaf' },
    update: {},
    create: {
      name: 'Combro Mocaf',
      slug: 'combro-mocaf',
      description: 'Makanan tradisional khas berbahan dasar singkong terfermentasi (Modified Cassava Flour/MOCAF). Diolah secara higienis oleh ibu-ibu KWT Loh Jinawi 1 dengan cita rasa gurih dan tekstur renyah. Kemasan ±110 gram per bungkus.',
      price: 15000,
      stock: 50,
      weight: 110,
      unit: 'bungkus',
      certification: 'P-IRT No. 2068804011911-26',
      isActive: true,
    },
  });

  console.log('Seeding profile content...');
  // Seed ProfileContent
  await prisma.profileContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      groupName: 'KWT Loh Jinawi 1',
      tagline: 'Produk Pangan Lokal Berkualitas dari Kaliurip, Banjarnegara',
      history: 'KWT Loh Jinawi 1 dibentuk melalui musyawarah anggota pada 11 Desember 2019 di Desa Kaliurip, Kecamatan Madukara, Kabupaten Banjarnegara. Dilandasi semangat gotong royong dan kemandirian ekonomi wanita desa, dengan dukungan penuh perangkat Desa Kaliurip. Sejak awal berdiri terus bertransformasi, kini aktif memproduksi combro mocaf dengan jangkauan pasar hingga Jakarta dan Tangerang.',
      vision: 'Menjadi kelompok wanita tani yang mandiri dan produktif dalam menghasilkan produk pangan lokal berkualitas tinggi untuk kesejahteraan anggota dan masyarakat Desa Kaliurip.',
      missions: [
        'Meningkatkan keterampilan anggota dalam pengolahan produk pangan lokal',
        'Menghasilkan produk pangan higienis dan bersertifikasi sesuai standar keamanan pangan',
        'Memperluas jangkauan pemasaran melalui platform digital',
        'Mendorong kemandirian ekonomi anggota melalui pengelolaan keuangan yang transparan',
        'Memperkuat solidaritas dan kerjasama antar anggota',
      ],
      address: 'Jln. Raya Kaliurip-Pakelen, RT 04/RW 02, Desa Kaliurip, Kecamatan Madukara, Kabupaten Banjarnegara',
      whatsapp: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890',
      foundedDate: '11 Desember 2019',
    },
  });

  console.log('Seeding organization members...');
  // Seed OrganizationMembers
  await prisma.organizationMember.deleteMany();
  await prisma.organizationMember.createMany({
    data: [
      { displayOrder: 1, position: 'Penasehat', name: 'Radi (Kepala Desa Kaliurip)', section: '', isManagement: true },
      { displayOrder: 2, position: 'Ketua', name: "Atin Mu'asyaroh", section: '', isManagement: true },
      { displayOrder: 3, position: 'Sekretaris', name: 'Muslimah', section: '', isManagement: true },
      { displayOrder: 4, position: 'Bendahara', name: 'Umi Musrifah', section: '', isManagement: true },
      { displayOrder: 5, position: 'Kepala Seksi Pertanian', name: 'Karinem', section: 'Seksi Pertanian', isManagement: false },
      { displayOrder: 6, position: 'Kepala Seksi Perikanan', name: 'Novi Prihatining Tiyas', section: 'Seksi Perikanan', isManagement: false },
      { displayOrder: 7, position: 'Kepala Seksi Peternakan', name: 'Tuyem', section: 'Seksi Peternakan', isManagement: false },
      { displayOrder: 8, position: 'Kepala Seksi Pengolahan Hasil', name: 'Susniwati', section: 'Seksi Pengolahan Hasil', isManagement: false },
      { displayOrder: 9, position: 'Kepala Seksi Pemasaran Hasil', name: 'Main Nurwati', section: 'Seksi Pemasaran Hasil', isManagement: false },
    ],
  });

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
