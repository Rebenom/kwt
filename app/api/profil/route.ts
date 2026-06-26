import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const profile = await prisma.profileContent.findUnique({
      where: { id: 'singleton' },
    });

    const members = await prisma.organizationMember.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json({ profile, members });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { groupName, tagline, history, vision, missions, address, whatsapp, foundedDate } = body;

    const updatedProfile = await prisma.profileContent.upsert({
      where: { id: 'singleton' },
      update: {
        groupName,
        tagline,
        history,
        vision,
        missions,
        address,
        whatsapp,
        foundedDate,
      },
      create: {
        id: 'singleton',
        groupName: groupName || 'KWT Loh Jinawi 1',
        tagline,
        history: history || '',
        vision: vision || '',
        missions: missions || [],
        address: address || '',
        whatsapp: whatsapp || '',
        foundedDate: foundedDate || '11 Desember 2019',
      },
    });

    return NextResponse.json({ profile: updatedProfile });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
