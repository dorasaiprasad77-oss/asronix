import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export interface FeedbackRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  review: string;
  rating: number;
  category: string;
  approved: boolean;
  createdAt: string;
}

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

export function getFeedbacks(): FeedbackRecord[] {
  return readJson("feedbacks.json");
}

export function getApprovedFeedbacks(): FeedbackRecord[] {
  return getFeedbacks().filter((f) => f.approved);
}

export function addFeedback(data: Omit<FeedbackRecord, "id" | "createdAt" | "approved">): FeedbackRecord {
  const items = getFeedbacks();
  const record: FeedbackRecord = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
    approved: false,
  };
  items.unshift(record);
  writeJson("feedbacks.json", items);
  return record;
}

export function approveFeedback(id: string): FeedbackRecord | null {
  const items = getFeedbacks();
  const idx = items.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  items[idx].approved = !items[idx].approved;
  writeJson("feedbacks.json", items);
  return items[idx];
}

export function deleteFeedback(id: string): boolean {
  const items = getFeedbacks();
  const filtered = items.filter((f) => f.id !== id);
  if (filtered.length === items.length) return false;
  writeJson("feedbacks.json", filtered);
  return true;
}

export interface ClientProject {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  status: "pending" | "in-progress" | "review" | "completed";
  description: string;
  files: { name: string; url: string; date: string }[];
  messages: { from: string; text: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export function getClientProjects(clientId: string): ClientProject[] {
  const all = readJson("client-projects.json") as ClientProject[];
  return all.filter((p) => p.clientId === clientId);
}

export function getAllProjects(): ClientProject[] {
  return readJson("client-projects.json") as ClientProject[];
}

export function addProject(data: Omit<ClientProject, "id" | "createdAt" | "updatedAt" | "files" | "messages">): ClientProject {
  const items = readJson("client-projects.json") as ClientProject[];
  const now = new Date().toISOString();
  const record: ClientProject = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    files: [],
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  items.push(record);
  writeJson("client-projects.json", items);
  return record;
}

export function updateProjectStatus(id: string, status: ClientProject["status"]): ClientProject | null {
  const items = readJson("client-projects.json") as ClientProject[];
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  items[idx].status = status;
  items[idx].updatedAt = new Date().toISOString();
  writeJson("client-projects.json", items);
  return items[idx];
}

export function addProjectMessage(id: string, from: string, text: string): ClientProject | null {
  const items = readJson("client-projects.json") as ClientProject[];
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  items[idx].messages.push({ from, text, date: new Date().toISOString() });
  items[idx].updatedAt = new Date().toISOString();
  writeJson("client-projects.json", items);
  return items[idx];
}

export function addProjectFile(id: string, name: string, url: string): ClientProject | null {
  const items = readJson("client-projects.json") as ClientProject[];
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  items[idx].files.push({ name, url, date: new Date().toISOString() });
  items[idx].updatedAt = new Date().toISOString();
  writeJson("client-projects.json", items);
  return items[idx];
}

export interface ClientAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: string;
}

export function getClients(): ClientAccount[] {
  return readJson("clients.json") as ClientAccount[];
}

export function addClient(data: Omit<ClientAccount, "id" | "createdAt">): ClientAccount {
  const items = getClients();
  const record: ClientAccount = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
  };
  items.push(record);
  writeJson("clients.json", items);
  return record;
}

export function authenticateClient(email: string, password: string): ClientAccount | null {
  const clients = getClients();
  return clients.find((c) => c.email === email && c.password === password) || null;
}
