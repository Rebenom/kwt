import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds the 2MB limit' }, { status: 400 });
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file format. Use JPEG, PNG, or WEBP.' }, { status: 400 });
    }

    // Generate unique name: [timestamp]-[random].[ext]
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${randomStr}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize service role client to bypass storage RLS
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceRole) {
      return NextResponse.json({ error: 'Server configuration error: missing Supabase credentials' }, { status: 500 });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRole, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Upload to Supabase Storage using adminClient
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('product-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('product-images')
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
