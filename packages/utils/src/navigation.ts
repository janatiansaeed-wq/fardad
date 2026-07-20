import type { NavigationItem } from "@fardad/types";

function hasRequiredCapabilities(
  item: NavigationItem,
  visibleCapabilities: ReadonlySet<string>,
): boolean {
  const allRequirementsMet = (item.requiresAllCapabilities ?? []).every((capability) =>
    visibleCapabilities.has(capability),
  );
  const anyRequirementsMet =
    !item.requiresAnyCapabilities?.length ||
    item.requiresAnyCapabilities.some((capability) => visibleCapabilities.has(capability));

  return allRequirementsMet && anyRequirementsMet;
}

export function filterNavigationItems(
  items: readonly NavigationItem[],
  visibleCapabilities: ReadonlySet<string>,
): NavigationItem[] {
  return items.flatMap((item) => {
    if (item.isVisible === false || !hasRequiredCapabilities(item, visibleCapabilities)) {
      return [];
    }

    const children = item.children
      ? filterNavigationItems(item.children, visibleCapabilities)
      : undefined;

    return [{ ...item, ...(children ? { children } : {}) }];
  });
}

export function normalizeNavigationItems(items: readonly NavigationItem[]): NavigationItem[] {
  const seenIds = new Set<string>();

  return items.flatMap((item) => {
    const id = item.id.trim();
    const label = item.label.trim();
    const href = item.href.trim();

    if (!id || !label || !href || seenIds.has(id)) {
      return [];
    }

    seenIds.add(id);
    const children = item.children ? normalizeNavigationItems(item.children) : undefined;

    return [{ ...item, id, label, href, ...(children?.length ? { children } : {}) }];
  });
}
