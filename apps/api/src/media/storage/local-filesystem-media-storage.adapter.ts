import { Injectable } from "@nestjs/common";
import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { env } from "../../config";
import type { LocalMediaReadRequest, LocalMediaReadResult } from "../media.types";
import type { MediaStorageAdapter } from "./media-storage.adapter";

const maximumLocalMediaBytes = 20 * 1024 * 1024;

@Injectable()
export class LocalFilesystemMediaStorageAdapter implements MediaStorageAdapter {
  async read(request: LocalMediaReadRequest): Promise<LocalMediaReadResult | null> {
    if (
      env.NODE_ENV !== "development" ||
      env.MEDIA_DELIVERY_MODE !== "local" ||
      !env.MEDIA_LOCAL_ROOT ||
      !isSafeExpectedSize(request.expectedByteSize) ||
      !isSafeStorageReference(request.storageReference)
    ) {
      return null;
    }

    const configuredRoot = resolve(env.MEDIA_LOCAL_ROOT);

    if (isStorefrontPublicRoot(configuredRoot)) {
      return null;
    }

    try {
      const root = await realpath(configuredRoot);
      const candidate = await realpath(resolve(root, request.storageReference));
      const relativePath = relative(root, candidate);

      if (
        !relativePath ||
        relativePath.startsWith(`..${sep}`) ||
        relativePath === ".." ||
        isAbsolute(relativePath)
      ) {
        return null;
      }

      const file = await stat(candidate);

      if (
        !file.isFile() ||
        file.size !== request.expectedByteSize ||
        file.size > maximumLocalMediaBytes
      ) {
        return null;
      }

      return {
        byteSize: file.size,
        stream: createReadStream(candidate),
      };
    } catch {
      return null;
    }
  }
}

function isSafeExpectedSize(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0 && value <= maximumLocalMediaBytes;
}

function isSafeStorageReference(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= 1024 &&
    !value.includes("\0") &&
    !isAbsolute(value) &&
    !value.split(/[\\/]+/).includes("..")
  );
}

function isStorefrontPublicRoot(root: string): boolean {
  const normalized = root
    .toLowerCase()
    .split(/[\\/]+/)
    .filter(Boolean);

  for (let index = 0; index <= normalized.length - 3; index += 1) {
    if (
      normalized[index] === "apps" &&
      normalized[index + 1] === "storefront" &&
      normalized[index + 2] === "public"
    ) {
      return true;
    }
  }

  return false;
}
