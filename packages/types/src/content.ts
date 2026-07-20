import type { NavigationItem } from "./navigation";

export type LocalizedContentProfile = Readonly<{
  id: string;
  version: number;
  approval: "provisional" | "approved";
  sourceVersion: string;
  locale: string;
  navigation: readonly NavigationItem[];
  shell: Readonly<{
    skipToContent: string;
    primaryNavigationLabel: string;
    mobileMenuLabel: string;
    footerDescription: string;
  }>;
  home: Readonly<{
    hero: Readonly<{
      eyebrow: string;
      titleBeforeBreak: string;
      titleAfterBreak: string;
      description: string;
      primaryAction: string;
      secondaryAction: string;
    }>;
    features: Readonly<{
      title: string;
      subtitle: string;
      items: readonly Readonly<{ title: string; description: string }>[];
    }>;
    categories: Readonly<{
      title: string;
      subtitle: string;
      items: readonly string[];
    }>;
  }>;
  catalog: Readonly<{
    metadataTitle: string;
    metadataDescription: string;
    heading: string;
    introduction: string;
    categoryLabel: string;
    categoryDescriptionTemplate: string;
    categoryNavigationLabel: string;
    emptyTitle: string;
    emptyCategoryTitleTemplate: string;
    emptyDescription: string;
    previousPage: string;
    nextPage: string;
    paginationLabel: string;
    missingImageAltTemplate: string;
    missingImageMark: string;
    missingImageMessage: string;
    loading: string;
  }>;
  states: Readonly<{
    loadingTitle: string;
    loadingDescription: string;
    globalErrorTitle: string;
    productsErrorTitle: string;
    categoryErrorTitle: string;
    retryDescription: string;
    retryAction: string;
    notFoundTitle: string;
    notFoundDescription: string;
    homeAction: string;
  }>;
  seo: Readonly<{
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    keywords?: readonly string[];
    robots: Readonly<{ index: boolean; follow: boolean }>;
    openGraphLocale: string;
  }>;
  provisionalFields: readonly string[];
}>;
