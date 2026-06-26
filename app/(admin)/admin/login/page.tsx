'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if session already exists
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin/dashboard');
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <Card variant="elevated" className="p-8 border border-gray-200">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="p-3 bg-primary-light rounded-2xl text-primary inline-block">
            <Leaf className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">KWT Loh Jinawi 1</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Panel Administrator</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-lg animate-in fade-in duration-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Alamat Email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <div className="relative">
            <Input
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[34px] text-gray-400 hover:text-gray-600 transition-colors p-1"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button type="submit" fullWidth loading={loading} className="mt-2 font-bold py-2.5">
            Masuk ke Panel
          </Button>
        </form>
      </Card>
    </div>
  );
}
