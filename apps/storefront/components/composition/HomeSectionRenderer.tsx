import type { HomeSectionId, StorefrontProfile } from "@fardad/types";
import Categories from "@/components/home/Categories";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";

type HomeSectionRendererProps = Readonly<{
  profile: StorefrontProfile;
}>;

function renderSection(section: HomeSectionId, profile: StorefrontProfile) {
  switch (section) {
    case "hero":
      return (
        <Hero
          key={section}
          content={profile.content.home.hero}
          variant={profile.experience.home.hero}
        />
      );
    case "features":
      return (
        <Features
          key={section}
          content={profile.content.home.features}
          variant={profile.experience.home.features}
        />
      );
    case "categories":
      return (
        <Categories
          key={section}
          content={profile.content.home.categories}
          variant={profile.experience.home.categories}
        />
      );
  }
}

export default function HomeSectionRenderer({ profile }: HomeSectionRendererProps) {
  return <>{profile.experience.home.sections.map((section) => renderSection(section, profile))}</>;
}
