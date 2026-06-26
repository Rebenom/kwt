import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
      });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        ...product,
        price: Number(product.price),
      },
    });
  } catch (error: any) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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

    let product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      product = await prisma.product.findUnique({ where: { slug: id } });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const dataToUpdate: any = {};

    if (body.name !== undefined) {
      dataToUpdate.name = body.name;
      if (body.name !== product.name) {
        const baseSlug = generateSlug(body.name);
        let slug = baseSlug;
        let count = 1;
        while (true) {
          const existing = await prisma.product.findFirst({
            where: { slug, id: { not: product.id } },
          });
          if (!existing) break;
          slug = `${baseSlug}-${count}`;
          count++;
        }
        dataToUpdate.slug = slug;
      }
    }

    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.price !== undefined) dataToUpdate.price = Number(body.price);
    if (body.stock !== undefined) dataToUpdate.stock = Number(body.stock);
    if (body.weight !== undefined) dataToUpdate.weight = body.weight ? Number(body.weight) : null;
    if (body.unit !== undefined) dataToUpdate.unit = body.unit;
    if (body.certification !== undefined) dataToUpdate.certification = body.certification;
    if (body.imageUrl !== undefined) dataToUpdate.imageUrl = body.imageUrl;
    if (body.isActive !== undefined) dataToUpdate.isActive = body.isActive;

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      product: {
        ...updatedProduct,
        price: Number(updatedProduct.price),
      },
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
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

    let product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      product = await prisma.product.findUnique({ where: { slug: id } });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Soft delete: set isActive = false
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: 'Product soft deleted successfully',
      product: {
        ...updatedProduct,
        price: Number(updatedProduct.price),
      },
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
