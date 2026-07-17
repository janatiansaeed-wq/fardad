import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        sku: body.sku,
        price: body.price,
        stock: body.stock ?? 0,
        published: body.published ?? false,
        featured: body.featured ?? false,
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Unable to create product." },
      { status: 500 }
    );
  }
}
