'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Info, Users, Plus, ArrowUp, ArrowDown, Trash2, Edit } from 'lucide-react';
import { ProfileContent, OrganizationMember } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function ProfileAdminPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'history' | 'org'>('basic');
  const [profile, setProfile] = useState<ProfileContent | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for profile
  const [groupName, setGroupName] = useState('');
  const [tagline, setTagline] = useState('');
  const [foundedDate, setFoundedDate] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [history, setHistory] = useState('');
  const [vision, setVision] = useState('');
  const [missionsList, setMissionsList] = useState<string[]>([]);
  const [newMissionText, setNewMissionText] = useState('');

  // Modal states for member CRUD
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState<'add' | 'edit'>('add');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberPosition, setMemberPosition] = useState('');
  const [memberSection, setMemberSection] = useState('');
  const [memberIsManagement, setMemberIsManagement] = useState(false);
  const [memberDisplayOrder, setMemberDisplayOrder] = useState('0');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/profil');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memuat profil KWT.');

      setProfile(data.profile);
      setMembers(data.members || []);

      if (data.profile) {
        setGroupName(data.profile.groupName || 'KWT Loh Jinawi 1');
        setTagline(data.profile.tagline || '');
        setFoundedDate(data.profile.foundedDate || '11 Desember 2019');
        setWhatsapp(data.profile.whatsapp || '');
        setAddress(data.profile.address || '');
        setHistory(data.profile.history || '');
        setVision(data.profile.vision || '');
        setMissionsList(
          Array.isArray(data.profile.missions) ? (data.profile.missions as string[]) : []
        );
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memuat profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        groupName,
        tagline,
        foundedDate,
        whatsapp,
        address,
        history,
        vision,
        missions: missionsList,
      };

      const res = await fetch('/api/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan profil.');

      setProfile(data.profile);
      setSuccessMsg('Profil berhasil diperbarui!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memperbarui profil.');
    } finally {
      setSaving(false);
    }
  };

  // Missions handlers
  const handleAddMission = () => {
    if (!newMissionText.trim()) return;
    setMissionsList([...missionsList, newMissionText.trim()]);
    setNewMissionText('');
  };

  const handleRemoveMission = (idx: number) => {
    setMissionsList(missionsList.filter((_, i) => i !== idx));
  };

  const handleMoveMission = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === missionsList.length - 1) return;

    const newList = [...missionsList];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = newList[idx];
    newList[idx] = newList[targetIdx];
    newList[targetIdx] = temp;
    setMissionsList(newList);
  };

  // Member CRUD handlers
  const openAddMemberModal = () => {
    setMemberModalMode('add');
    setEditingMemberId(null);
    setMemberName('');
    setMemberPosition('');
    setMemberSection('');
    setMemberIsManagement(false);
    setMemberDisplayOrder((members.length + 1).toString());
    setError(null);
    setIsMemberModalOpen(true);
  };

  const openEditMemberModal = (member: OrganizationMember) => {
    setMemberModalMode('edit');
    setEditingMemberId(member.id);
    setMemberName(member.name);
    setMemberPosition(member.position);
    setMemberSection(member.section || '');
    setMemberIsManagement(member.isManagement);
    setMemberDisplayOrder(member.displayOrder.toString());
    setError(null);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberPosition) {
      setError('Nama dan Jabatan wajib diisi.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: memberName,
      position: memberPosition,
      section: memberSection || null,
      isManagement: memberIsManagement,
      displayOrder: parseInt(memberDisplayOrder) || 0,
    };

    try {
      let res;
      if (memberModalMode === 'add') {
        res = await fetch('/api/anggota', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/anggota/${editingMemberId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan pengurus.');

      setIsMemberModalOpen(false);
      setSuccessMsg(
        memberModalMode === 'add'
          ? 'Pengurus berhasil ditambahkan!'
          : 'Pengurus berhasil diperbarui!'
      );
      fetchProfileData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menyimpan pengurus.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    const confirmation = confirm('Apakah Anda yakin ingin menghapus pengurus ini?');
    if (!confirmation) return;

    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/anggota/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengurus.');

      setSuccessMsg('Pengurus berhasil dihapus!');
      fetchProfileData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menghapus pengurus.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
        <p className="text-sm font-semibold">Memuat profil KWT...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight">Manajemen Profil KWT</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola sejarah, visi misi, kontak, dan struktur kepengurusan organisasi.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl animate-in fade-in duration-200">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => {
            setActiveTab('basic');
            setSuccessMsg(null);
            setError(null);
          }}
          className={`pb-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'basic' ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-500 hover:text-gray-950'
          }`}
        >
          <Info className="w-4.5 h-4.5" />
          <span>Informasi Dasar</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('history');
            setSuccessMsg(null);
            setError(null);
          }}
          className={`pb-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'history' ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-500 hover:text-gray-950'
          }`}
        >
          <Settings className="w-4.5 h-4.5" />
          <span>Sejarah &amp; Visi Misi</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('org');
            setSuccessMsg(null);
            setError(null);
          }}
          className={`pb-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'org' ? 'border-primary text-primary font-bold' : 'border-transparent text-gray-500 hover:text-gray-950'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          <span>Struktur Organisasi</span>
        </button>
      </div>

      {/* Tab 1: Basic Information */}
      {activeTab === 'basic' && (
        <form onSubmit={handleSaveProfile} className="max-w-3xl flex flex-col gap-6">
          <Card variant="default" className="p-6 flex flex-col gap-5">
            <h3 className="font-bold text-gray-950 text-base pb-2 border-b border-gray-100">Kontak &amp; Lokasi</h3>
            
            <Input
              label="Tagline Kelompok"
              type="text"
              placeholder="Contoh: Olahan Singkong MOCAF Khas Kaliurip"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              disabled={saving}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tanggal Berdiri"
                type="text"
                placeholder="11 Desember 2019"
                value={foundedDate}
                onChange={(e) => setFoundedDate(e.target.value)}
                required
                disabled={saving}
              />

              <Input
                label="Nomor WhatsApp Admin (tanpa spasi / +)"
                type="text"
                placeholder="Contoh: 628123456789"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                disabled={saving}
                helperText="Nomor ini akan digunakan sebagai admin penerima order produk."
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Alamat Lengkap KWT</label>
              <textarea
                rows={3}
                placeholder="Tuliskan jalan, RT/RW, desa, kecamatan, kabupaten..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                disabled={saving}
              />
            </div>
          </Card>

          <div className="flex self-start">
            <Button type="submit" loading={saving} className="font-bold py-2.5 px-6">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: History & Vision/Mission */}
      {activeTab === 'history' && (
        <form onSubmit={handleSaveProfile} className="max-w-4xl flex flex-col gap-6">
          <Card variant="default" className="p-6 flex flex-col gap-5">
            <h3 className="font-bold text-gray-950 text-base pb-2 border-b border-gray-100">Sejarah &amp; Visi Kelompok</h3>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Sejarah Pembentukan</label>
              <textarea
                rows={8}
                placeholder="Ceritakan latar belakang didirikannya KWT, perkembangan, dan pencapaian..."
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm leading-relaxed"
                required
                disabled={saving}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Visi Utama</label>
              <textarea
                rows={4}
                placeholder="Tulis visi KWT..."
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm leading-relaxed"
                required
                disabled={saving}
              />
            </div>
          </Card>

          <Card variant="default" className="p-6 flex flex-col gap-5">
            <h3 className="font-bold text-gray-950 text-base pb-2 border-b border-gray-100">Misi Organisasi</h3>

            {/* List of current missions */}
            <div className="flex flex-col gap-3">
              {missionsList.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Misi belum ditentukan.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {missionsList.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-primary-light text-primary font-bold text-xxs">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 font-medium leading-normal">{m}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveMission(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-150 rounded-md transition-colors disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveMission(idx, 'down')}
                          disabled={idx === missionsList.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-150 rounded-md transition-colors disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMission(idx)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Mission Form */}
            <div className="flex gap-2 items-end border-t border-gray-100 pt-4 mt-2">
              <div className="flex-1">
                <Input
                  label="Tambah Misi Baru"
                  type="text"
                  placeholder="Ketikkan rumusan misi..."
                  value={newMissionText}
                  onChange={(e) => setNewMissionText(e.target.value)}
                  disabled={saving}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddMission}
                variant="secondary"
                className="font-bold py-2 px-4 whitespace-nowrap mb-1"
                disabled={saving}
              >
                + Tambah Misi
              </Button>
            </div>
          </Card>

          <div className="flex self-start">
            <Button type="submit" loading={saving} className="font-bold py-2.5 px-6">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      )}

      {/* Tab 3: Organization Structure */}
      {activeTab === 'org' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-base">Struktur Pengurus Kelompok</h3>
            <Button onClick={openAddMemberModal} icon={<Plus className="w-4 h-4" />} className="font-bold text-sm">
              Tambah Pengurus
            </Button>
          </div>

          <Card variant="default" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase">
                    <th className="px-6 py-4">Nama Pengurus</th>
                    <th className="px-6 py-4">Jabatan</th>
                    <th className="px-6 py-4">Seksi</th>
                    <th className="px-6 py-4 text-center">Tipe</th>
                    <th className="px-6 py-4 text-center">Urutan Tampil</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Belum ada data struktur pengurus.
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-950">{m.name}</td>
                        <td className="px-6 py-4 text-gray-700 font-semibold">{m.position}</td>
                        <td className="px-6 py-4 text-gray-500">{m.section || '-'}</td>
                        <td className="px-6 py-4 text-center">
                          {m.isManagement ? (
                            <Badge variant="success">Inti (Manajemen)</Badge>
                          ) : (
                            <Badge variant="neutral">Seksi Kerja</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-700">{m.displayOrder}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3.5">
                            <button
                              onClick={() => openEditMemberModal(m)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMember(m.id)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
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

          {/* Member Modal Form */}
          <Modal
            isOpen={isMemberModalOpen}
            onClose={() => setIsMemberModalOpen(false)}
            title={memberModalMode === 'add' ? 'Tambah Pengurus Baru' : 'Edit Data Pengurus'}
          >
            <form onSubmit={handleSaveMember} className="flex flex-col gap-4">
              <Input
                label="Nama Pengurus"
                type="text"
                placeholder="Contoh: Main Nurwati"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                required
                disabled={saving}
              />

              <Input
                label="Jabatan"
                type="text"
                placeholder="Contoh: Kepala Seksi Pemasaran Hasil"
                value={memberPosition}
                onChange={(e) => setMemberPosition(e.target.value)}
                required
                disabled={saving}
              />

              <Input
                label="Seksi (Opsional)"
                type="text"
                placeholder="Contoh: Seksi Pemasaran Hasil"
                value={memberSection}
                onChange={(e) => setMemberSection(e.target.value)}
                disabled={saving}
                helperText="Nama seksi yang dipegang jika ada."
              />

              <div className="flex items-center justify-between border border-gray-250 p-3 rounded-lg bg-gray-50 my-1">
                <div>
                  <span className="text-sm font-bold text-gray-800 block">Jajaran Pengurus Inti</span>
                  <span className="text-xxs text-gray-400 mt-0.5 block">
                    Penasehat, Ketua, Sekretaris, Bendahara
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={memberIsManagement}
                  onChange={(e) => setMemberIsManagement(e.target.checked)}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                  disabled={saving}
                />
              </div>

              <Input
                label="Urutan Tampil (Display Order)"
                type="number"
                min="0"
                placeholder="Contoh: 1"
                value={memberDisplayOrder}
                onChange={(e) => setMemberDisplayOrder(e.target.value)}
                required
                disabled={saving}
                helperText="Mengontrol urutan visual kepengurusan dari terkecil ke terbesar."
              />

              <div className="flex gap-3 mt-4 border-t border-gray-100 pt-4">
                <Button type="submit" loading={saving} className="flex-1 font-bold">
                  Simpan Pengurus
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="flex-1 font-semibold"
                  disabled={saving}
                >
                  Batal
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}
