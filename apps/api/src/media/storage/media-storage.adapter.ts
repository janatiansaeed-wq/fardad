import type { LocalMediaReadRequest, LocalMediaReadResult } from "../media.types";

export const MEDIA_STORAGE_ADAPTER = Symbol("MEDIA_STORAGE_ADAPTER");

export interface MediaStorageAdapter {
  read(request: LocalMediaReadRequest): Promise<LocalMediaReadResult | null>;
}
