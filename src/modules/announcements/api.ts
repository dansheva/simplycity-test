import type { Announcement, Category } from "./models";
import { announcementStore, categoryStore, ensureSeedAnnouncements } from "./storage";

const sleep = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function listAnnouncements(): Promise<Announcement[]> {
  ensureSeedAnnouncements();
  await sleep();
  return announcementStore.list();
}

export async function getAnnouncement(id: string): Promise<Announcement | undefined> {
  ensureSeedAnnouncements();
  await sleep();
  return announcementStore.get(id);
}

export async function createAnnouncement(
  input: Omit<Announcement, "id" | "updatedAt">,
): Promise<Announcement> {
  ensureSeedAnnouncements();
  await sleep();
  return announcementStore.create(input);
}

export async function updateAnnouncement(
  id: string,
  patch: Partial<Omit<Announcement, "id">>,
): Promise<Announcement> {
  ensureSeedAnnouncements();
  await sleep();
  const updated = announcementStore.update(id, patch);
  if (!updated) throw new Error("Announcement not found");
  return updated;
}

/** Categories catalog (for selects, rendering) */
export async function listCategories(): Promise<Category[]> {
  ensureSeedAnnouncements();
  await sleep(80);
  return categoryStore.list();
}
