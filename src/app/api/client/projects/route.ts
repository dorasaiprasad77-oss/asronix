import { NextResponse } from "next/server";
import { getClientProjects } from "@/lib/feedback";

export async function POST(request: Request) {
  try {
    const { clientId } = await request.json();
    if (!clientId) return NextResponse.json({ error: "Client ID required" }, { status: 400 });
    const projects = getClientProjects(clientId);
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
