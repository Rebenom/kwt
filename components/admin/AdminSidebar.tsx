'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Settings, ExternalLink, LogOut, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@/lib/supabase/client';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient();

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Produk', href: '/admin/produk', icon: Package },
    { label: 'Profil KWT', href: '/admin/profil', icon: Settings },
  ];

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari panel admin?')) {
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    }
  };

  return (
    <aside className="w-60 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <div className="p-1.5 bg-primary-light rounded-lg text-primary">
          <Leaf className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 className="font-extrabold text-gray-900 text-sm tracking-tight">Loh Jinawi Admin</h1>
          <p className="text-xxs text-gray-400 font-semibold tracking-wider uppercase">Panel Administrator</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-primary-light text-primary-dark'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-primary-dark' : 'text-gray-500')} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <hr className="border-gray-100 my-2" />

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-950 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-gray-500" />
          <span>Lihat Website</span>
        </Link>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
