export interface CmsPage {

  id: string;

  title: string;

  slug: string;

  published: boolean;

  sections: CmsSection[];

}

export interface CmsSection {

  id: string;

  component: string;

  order: number;

  settings: Record<string, unknown>;

}