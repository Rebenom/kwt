import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const dataToUpdate: any = {};

    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.position !== undefined) dataToUpdate.position = body.position;
    if (body.section !== undefined) dataToUpdate.section = body.section || null;
    if (body.displayOrder !== undefined) dataToUpdate.displayOrder = Number(body.displayOrder);
    if (body.isManagement !== undefined) dataToUpdate.isManagement = Boolean(body.isManagement);

    const member = await prisma.organizationMember.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ member });
  } catch (error: any) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.organizationMember.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
