import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveUpload(
  file: File,
  folder = "products",
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filepath = path.join(dir, filename);

  await writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}
