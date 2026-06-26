'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Check, Leaf } from 'lucide-react';
import { Product } from '@/types';
import { generateSlug } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface EditProductFormProps {
  product: Product;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();

  // Form States
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [slugEdited, setSlugEdited] = useState(true);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [weight, setWeight] = useState(product.weight?.toString() || '');
  const [unit, setUnit] = useState(product.unit);
  const [certification, setCertification] = useState(product.certification || '');
  const [isActive, setIsActive] = useState(product.isActive);

  // Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl);
  const [imageUrl, setImageUrl] = useState<string | null>(product.imageUrl);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Submit states
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slugEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(generateSlug(e.target.value));
    setSlugEdited(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadSuccess(false);
      setImageUrl(null);
      setUploadingImage(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal mengupload gambar.');
        }

        setImageUrl(data.url);
        setUploadSuccess(true);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Terjadi kesalahan saat mengupload gambar.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !stock) {
      setError('Mohon lengkapi semua kolom wajib (*)');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name,
        slug,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        weight: weight ? parseInt(weight) : null,
        unit,
        certification,
        imageUrl,
        isActive,
      };

      const res = await fetch(`/api/produk/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui produk.');
      }

      alert('Produk berhasil diperbarui.');
      router.push('/admin/produk');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memperbarui produk. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div className="flex items-center gap-3">
        <Link href="/admin/produk" className="text-gray-500 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-150 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight">Edit Produk</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: General Info */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card variant="default" className="p-6 flex flex-col gap-5">
            <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">Informasi Produk</h3>
            
            <Input
              label="Nama Produk"
              type="text"
              placeholder="Contoh: Combro Mocaf"
              value={name}
              onChange={handleNameChange}
              required
              disabled={saving}
            />

            <Input
              label="Slug URL"
              type="text"
              placeholder="contoh-combro-mocaf"
              value={slug}
              onChange={handleSlugChange}
              required
              disabled={saving}
              helperText="URL unik produk. Di-generate otomatis dari nama produk."
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Deskripsi Produk</label>
              <textarea
                rows={4}
                placeholder="Tuliskan deskripsi lengkap produk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Harga (Rupiah)"
                type="number"
                min="0"
                placeholder="Contoh: 15000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={saving}
              />

              <Input
                label="Stok"
                type="number"
                min="0"
                placeholder="Contoh: 50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Berat per Kemasan (gram)"
                type="number"
                min="0"
                placeholder="Contoh: 110"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={saving}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Satuan Kemasan</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-[9px] border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white text-sm"
                  disabled={saving}
                >
                  <option value="bungkus">bungkus</option>
                  <option value="kg">kg</option>
                  <option value="pcs">pcs</option>
                  <option value="pak">pak</option>
                </select>
              </div>

              <Input
                label="Sertifikasi Produk"
                type="text"
                placeholder="P-IRT No..."
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                disabled={saving}
              />
            </div>
          </Card>
        </div>

        {/* Right Side: Media & Settings */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Media Card */}
          <Card variant="default" className="p-6 flex flex-col gap-5">
            <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">Foto Produk</h3>
            
            <div className="border-2 border-dashed border-gray-250 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 min-h-48 relative overflow-hidden">
              {imagePreview ? (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-2">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold">Mengupload...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center p-4">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-gray-500 font-medium">Mengupload...</p>
                    </div>
                  ) : (
                    <>
                      <Leaf className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-xs text-gray-500 font-medium">Pilih berkas foto produk (JPEG, PNG, WEBP, maks 2MB)</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={saving || uploadingImage}
              />
              <label
                htmlFor="file-upload"
                className="w-full inline-flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-2 px-3 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer select-none"
                style={saving || uploadingImage ? { pointerEvents: 'none', opacity: 0.5 } : {}}
              >
                <Upload className="w-4 h-4 text-gray-400" />
                Pilih Berkas Baru
              </label>

              {uploadSuccess && (
                <div className="flex items-center gap-1.5 justify-center text-xs font-bold text-green-700 bg-green-50 border border-green-200 py-2 rounded-lg animate-in fade-in duration-200">
                  <Check className="w-4 h-4" />
                  <span>Gambar berhasil diupload</span>
                </div>
              )}
            </div>
          </Card>

          {/* Settings Card */}
          <Card variant="default" className="p-6 flex flex-col gap-5">
            <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">Pengaturan Publik</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 text-sm block">Status Tampilkan</span>
                <span className="text-xxs text-gray-400 font-semibold mt-0.5 block">Tampilkan produk di katalog publik</span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 accent-primary rounded-md cursor-pointer"
                disabled={saving}
              />
            </div>

            <hr className="border-gray-100" />

            <div className="flex gap-3">
              <Button
                type="submit"
                loading={saving}
                disabled={uploadingImage || (imageFile !== null && !uploadSuccess)}
                className="flex-1 font-bold py-2.5"
              >
                Simpan Edit
              </Button>
              <Link href="/admin/produk" className="flex-1">
                <Button variant="secondary" fullWidth className="font-semibold py-2.5" disabled={saving}>
                  Batal
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
