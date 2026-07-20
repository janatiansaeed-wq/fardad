import type { TextDirection } from "@fardad/types";

export function getInlineStart(direction: TextDirection): "left" | "right" {
  return direction === "rtl" ? "right" : "left";
}

export function isRtlDirection(direction: TextDirection): boolean {
  return direction === "rtl";
}
