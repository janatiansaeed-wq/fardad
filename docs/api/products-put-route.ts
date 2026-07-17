import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        sku: body.sku,
        price: body.price,
        stock: body.stock,
        published: body.published,
        featured: body.featured,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { message: "Unable to update product." },
      { status: 500 }
    );
  }
}
