import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';

  const isLoginPage = pathname === '/admin/login';

  if (!user && !isLoginPage) {
    redirect('/admin/login');
  }

  if (user && isLoginPage) {
    redirect('/admin/dashboard');
  }

  // Render login page clean (no sidebar)
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row">
      <AdminSidebar />
      <main className="flex-1 min-h-screen pl-60">
        <div className="p-6 sm:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
