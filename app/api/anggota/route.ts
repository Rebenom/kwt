import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, position, section, displayOrder, isManagement } = body;

    if (!name || !position) {
      return NextResponse.json({ error: 'Name and position are required' }, { status: 400 });
    }

    const member = await prisma.organizationMember.create({
      data: {
        name,
        position,
        section: section || null,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isManagement: isManagement !== undefined ? Boolean(isManagement) : false,
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
