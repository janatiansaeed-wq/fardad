import type { Readable } from "node:stream";

export const publicMediaPurposes = ["card", "detail", "gallery"] as const;

export type PublicMediaPurpose = (typeof publicMediaPurposes)[number];

export type PublicMediaDescriptor = Readonly<{
  src: string;
}>;

export type LocalMediaReadRequest = Readonly<{
  expectedByteSize: number;
  storageReference: string;
}>;

export type LocalMediaReadResult = Readonly<{
  byteSize: number;
  stream: Readable;
}>;
