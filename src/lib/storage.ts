import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson(filename: string): any[] {
  ensureDir();
  const fp = path.join(DATA_DIR, filename);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return [];
  }
}

function writeJson(filename: string, data: any[]): void {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// ====== Bookings ======

export interface BookingRecord {
  id: string;
  service: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  fileData?: string;
  fileName?: string;
  createdAt: string;
  status: "new" | "in-progress" | "completed" | "cancelled";
}

export function getBookings(): BookingRecord[] {
  return readJson("bookings.json");
}

export function addBooking(data: Omit<BookingRecord, "id" | "createdAt" | "status">): BookingRecord {
  const bookings = getBookings();
  const record: BookingRecord = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  bookings.unshift(record);
  writeJson("bookings.json", bookings);
  return record;
}

export function updateBookingStatus(id: string, status: BookingRecord["status"]): BookingRecord | null {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx].status = status;
  writeJson("bookings.json", bookings);
  return bookings[idx];
}

export function deleteBooking(id: string): boolean {
  const bookings = getBookings();
  const filtered = bookings.filter((b) => b.id !== id);
  if (filtered.length === bookings.length) return false;
  writeJson("bookings.json", filtered);
  return true;
}

// ====== Contacts ======

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export function getContacts(): ContactRecord[] {
  return readJson("contacts.json");
}

export function addContact(data: Omit<ContactRecord, "id" | "createdAt">): ContactRecord {
  const contacts = getContacts();
  const record: ContactRecord = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
  };
  contacts.unshift(record);
  writeJson("contacts.json", contacts);
  return record;
}

export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length === contacts.length) return false;
  writeJson("contacts.json", filtered);
  return true;
}

// ====== Replies / Communication Log ======

export interface ReplyRecord {
  id: string;
  bookingId?: string;
  contactId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export function getReplies(bookingId?: string, contactId?: string): ReplyRecord[] {
  const replies = readJson("replies.json");
  if (bookingId) {
    return replies.filter((r) => r.bookingId === bookingId);
  }
  if (contactId) {
    return replies.filter((r) => r.contactId === contactId);
  }
  return replies;
}

export function addReply(data: Omit<ReplyRecord, "id" | "createdAt">): ReplyRecord {
  const replies = getReplies();
  const record: ReplyRecord = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
  };
  replies.push(record);
  writeJson("replies.json", replies);
  return record;
}

// ====== Portfolio ======

export interface PortfolioRecord {
  id: string;
  title: string;
  client: string;
  industry: string;
  description: string;
  technologies: string[];
  image: string;
  gradient: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getPortfolioItems(): PortfolioRecord[] {
  return readJson("portfolio.json");
}

export function addPortfolioItem(data: Omit<PortfolioRecord, "id" | "createdAt" | "updatedAt">): PortfolioRecord {
  const items = getPortfolioItems();
  const now = new Date().toISOString();
  const record: PortfolioRecord = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: now,
    updatedAt: now,
  };
  items.push(record);
  writeJson("portfolio.json", items);
  return record;
}

export function updatePortfolioItem(id: string, data: Partial<Omit<PortfolioRecord, "id" | "createdAt">>): PortfolioRecord | null {
  const items = getPortfolioItems();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
  writeJson("portfolio.json", items);
  return items[idx];
}

export function deletePortfolioItem(id: string): boolean {
  const items = getPortfolioItems();
  const filtered = items.filter((p) => p.id !== id);
  if (filtered.length === items.length) return false;
  writeJson("portfolio.json", filtered);
  return true;
}

// ====== Services ======

export interface ServiceRecord {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  items: string[];
  price?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getServices(): ServiceRecord[] {
  return readJson("services.json");
}

export function addService(data: Omit<ServiceRecord, "id" | "createdAt" | "updatedAt">): ServiceRecord {
  const items = getServices();
  const now = new Date().toISOString();
  const record: ServiceRecord = { ...data, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8), createdAt: now, updatedAt: now };
  items.push(record);
  writeJson("services.json", items);
  return record;
}

export function updateService(id: string, data: Partial<Omit<ServiceRecord, "id" | "createdAt">>): ServiceRecord | null {
  const items = getServices();
  const idx = items.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
  writeJson("services.json", items);
  return items[idx];
}

export function deleteService(id: string): boolean {
  const items = getServices();
  const filtered = items.filter((s) => s.id !== id);
  if (filtered.length === items.length) return false;
  writeJson("services.json", filtered);
  return true;
}

// ====== Website Content ======

export interface SiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  aboutDescription: string;
  aboutStats: { label: string; value: string }[];
  contactPhone: string;
  contactEmail: string;
  contactInstagram: string;
  contactLocation: string;
  footerText: string;
  updatedAt: string;
}

export function getSiteContent(): SiteContent {
  const items = readJson("content.json");
  // Return default content if none saved yet
  if (items.length === 0) {
    return {
      heroHeadline: "Building AI-Powered Digital Experiences for the Future",
      heroSubheadline: "We create scalable websites, AI solutions, applications, branding systems, and digital growth experiences for startups and modern businesses.",
      aboutDescription: "Asronix Tech Agency is a next-generation digital technology startup delivering AI-powered solutions, modern web experiences, branding systems, applications, and business growth services.",
      aboutStats: [
        { label: "Projects Completed", value: "6+" },
        { label: "Happy Clients", value: "6+" },
        { label: "AI Solutions", value: "6+" },
        { label: "Team Members", value: "6+" },
      ],
      contactPhone: "7377532141",
      contactEmail: "asronixtechagency@gmail.com",
      contactInstagram: "@asronixtechagency",
      contactLocation: "Berhampur, Odisha",
      footerText: "© 2026 Asronix Tech Agency. All Rights Reserved.",
      updatedAt: new Date().toISOString(),
    };
  }
  return items[0];
}

export function updateSiteContent(data: Partial<Omit<SiteContent, "updatedAt">>): SiteContent {
  let items = readJson("content.json");
  const current = getSiteContent();
  const updated: SiteContent = { ...current, ...data, updatedAt: new Date().toISOString() };
  if (items.length === 0) {
    items = [updated];
  } else {
    items[0] = updated;
  }
  writeJson("content.json", items);
  return updated;
}
