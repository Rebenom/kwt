import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Map Decimal to number for JSON serialization
    const serializedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    return NextResponse.json({ products: serializedProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, stock, weight, unit, certification, imageUrl, isActive } = body;

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const baseSlug = generateSlug(name);
    // Ensure slug is unique
    let slug = baseSlug;
    let count = 1;
    while (true) {
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        stock: Number(stock),
        weight: weight ? Number(weight) : null,
        unit: unit || 'bungkus',
        certification,
        imageUrl,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(
      {
        product: {
          ...newProduct,
          price: Number(newProduct.price),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
