export type Announcement = {
  id: string;
  title: string;
  publicationDate: string; // ISO
  updatedAt: string; // ISO
  categories: string[]; // category IDs referencing Category.id
};
