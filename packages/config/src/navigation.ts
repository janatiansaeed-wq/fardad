import type { NavigationSource, StaticNavigationSource } from "@fardad/types";

export function createStaticNavigationSource(items: StaticNavigationSource["items"]): NavigationSource {
  return { kind: "static", items };
}
