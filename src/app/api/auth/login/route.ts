import { NextResponse } from "next/server";
import { createToken, ADMIN_CREDENTIALS } from "@/lib/auth";
import { authenticateClient } from "@/lib/feedback";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = createToken({ email, name: "Admin", role: "admin" });
      return NextResponse.json({ token, user: { email, name: "Admin", role: "admin" } });
    }

    const client = authenticateClient(email, password);
    if (client) {
      const token = createToken({ email: client.email, name: client.name, role: "client", clientId: client.id });
      return NextResponse.json({ token, user: { email: client.email, name: client.name, role: "client", clientId: client.id } });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
