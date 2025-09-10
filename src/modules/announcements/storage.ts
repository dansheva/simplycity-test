import type { Announcement, Category } from "./models";

const LS = {
  announcements: "mod:announcements",
  categories: "mod:announcements:categories",
} as const;

/** Seeds */
const seedCategories: Category[] = [
  { id: "cat-city", title: "City" },
  { id: "cat-events", title: "Community events" },
  { id: "cat-health", title: "Health" },
];

const seedAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Road maintenance on Main St.",
    categories: ["cat-city"],
    publicationDate: new Date(2025, 8, 1, 9, 0).toISOString(),
    updatedAt: new Date(2025, 8, 1, 9, 0).toISOString(),
    content:
      "Please be advised that Main St. will be closed for maintenance from Sept 1 to Sept 5.",
  },
  {
    id: "2",
    title: "Free flu shots this weekend",
    categories: ["cat-health", "cat-events"],
    publicationDate: new Date(2025, 8, 3, 12, 30).toISOString(),
    updatedAt: new Date(2025, 8, 3, 12, 30).toISOString(),
    content:
      "Get your free flu shots at the community center this Saturday and Sunday from 10am to 4pm.",
  },
];

/** utils */
const read = <T>(k: string): T | null => {
  const raw = localStorage.getItem(k);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};
const write = <T>(k: string, v: T) => localStorage.setItem(k, JSON.stringify(v));

export function ensureSeedAnnouncements() {
  if (!localStorage.getItem(LS.categories)) write(LS.categories, seedCategories);
  if (!localStorage.getItem(LS.announcements)) write(LS.announcements, seedAnnouncements);
}

/** Category catalog (module-local) */
export const categoryStore = {
  list(): Category[] {
    return read<Category[]>(LS.categories) ?? [];
  },
  map(): Record<string, string> {
    return Object.fromEntries(this.list().map((c) => [c.id, c.title]));
  },
  upsert(cat: Category) {
    const all = this.list();
    const i = all.findIndex((c) => c.id === cat.id);
    if (i >= 0) all[i] = cat;
    else all.push(cat);
    write(LS.categories, all);
  },
};

/** Announcements CRUD */
export const announcementStore = {
  list(): Announcement[] {
    return read<Announcement[]>(LS.announcements) ?? [];
  },
  get(id: string): Announcement | undefined {
    return this.list().find((a) => a.id === id);
  },
  create(input: Omit<Announcement, "id" | "updatedAt">): Announcement {
    const all = this.list();
    const entity: Announcement = {
      ...input,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    all.push(entity);
    write(LS.announcements, all);
    return entity;
  },
  update(id: string, patch: Partial<Omit<Announcement, "id">>): Announcement | undefined {
    const all = this.list();
    const idx = all.findIndex((a) => a.id === id);
    if (idx < 0) return undefined;
    const updated: Announcement = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    all[idx] = updated;
    write(LS.announcements, all);
    return updated;
  },
};
