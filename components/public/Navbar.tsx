'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Menu, X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Produk', href: '/produk' },
    { label: 'Tentang Kami', href: '/tentang' },
  ];

  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  const whatsappUrl = `https://wa.me/${adminPhone.replace(/[+\-\s]/g, '')}?text=${encodeURIComponent('Halo KWT Loh Jinawi 1! Saya tertarik dengan produk KWT.')}`;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-150',
        scrolled ? 'shadow-sm py-2 sm:py-3' : 'py-3 sm:py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl">
            <div className="p-1.5 bg-primary-light rounded-lg text-primary">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <span>KWT Loh Jinawi 1</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative font-semibold text-sm transition-colors py-1',
                    isActive ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" icon={<MessageCircle className="w-4 h-4 fill-current" />} className="font-semibold">
                Pesan Sekarang
              </Button>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-primary rounded-lg focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-md py-4 px-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'px-3 py-2 rounded-lg font-bold text-sm transition-colors',
                  isActive ? 'bg-primary-light text-primary-dark font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <hr className="border-gray-100 my-1" />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full"
          >
            <Button fullWidth icon={<MessageCircle className="w-4 h-4 fill-current" />}>
              Pesan Sekarang
            </Button>
          </a>
        </div>
      )}
    </header>
  );
};
