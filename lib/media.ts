import { promises as fs } from "fs";
import path from "path";

export interface MediaFileInfo {
  name: string;
  path: string;
  size: number;
  extension: string;
}

export async function deleteMedia(filePath: string): Promise<void> {
  const absolute = path.join(process.cwd(), "public", filePath);
  await fs.unlink(absolute);
}

export function getExtension(fileName: string): string {
  return path.extname(fileName).replace(".", "").toLowerCase();
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(path.join(process.cwd(), "public", filePath));
    return true;
  } catch {
    return false;
  }
}
