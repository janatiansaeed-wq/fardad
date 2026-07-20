import type { CommerceCapability } from "./capabilities";

export type NavigationTarget = "self" | "blank";

export type NavigationItem = Readonly<{
  id: string;
  label: string;
  href: string;
  target?: NavigationTarget;
  children?: readonly NavigationItem[];
  isVisible?: boolean;
  requiresAllCapabilities?: readonly CommerceCapability[];
  requiresAnyCapabilities?: readonly CommerceCapability[];
}>;

export type NavigationGroup = Readonly<{
  id: string;
  label: string;
  items: readonly NavigationItem[];
}>;

export type StaticNavigationSource = Readonly<{
  kind: "static";
  items: readonly NavigationItem[];
}>;

export type ManagedNavigationSource = Readonly<{
  kind: "managed";
  endpoint: string;
}>;

export type NavigationSource = StaticNavigationSource | ManagedNavigationSource;
