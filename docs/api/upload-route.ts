import { NextRequest, NextResponse } from "next/server";
import { saveUpload } from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file uploaded." },
        { status: 400 }
      );
    }

    const url = await saveUpload(file, "products");

    return NextResponse.json({
      success: true,
      url,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Upload failed." },
      { status: 500 }
    );
  }
}
