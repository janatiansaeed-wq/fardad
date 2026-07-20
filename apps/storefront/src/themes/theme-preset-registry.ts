import type { ThemePreset } from "@fardad/types";
import { luxuryHeritageThemePreset } from "./presets/luxury-heritage";

const themePresetRegistry = {
  "luxury-heritage": luxuryHeritageThemePreset,
} as const satisfies Readonly<Record<string, ThemePreset>>;

export function getThemePreset(id: keyof typeof themePresetRegistry): ThemePreset {
  return themePresetRegistry[id];
}
