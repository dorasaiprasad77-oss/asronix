import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { addClient, getClients } from "@/lib/feedback";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 });
    }

    const clients = getClients();
    if (clients.find((c) => c.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const client = addClient({ name, email, password, phone: phone || "" });
    const token = createToken({ email: client.email, name: client.name, role: "client", clientId: client.id });
    return NextResponse.json({ token, user: { email: client.email, name: client.name, role: "client", clientId: client.id } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
