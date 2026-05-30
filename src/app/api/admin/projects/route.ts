import { NextResponse } from "next/server";
import { getAllProjects, addProject, updateProjectStatus, addProjectMessage } from "@/lib/feedback";

export async function GET() {
  try {
    const projects = getAllProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "update-status") {
      const result = updateProjectStatus(body.id, body.status);
      if (!result) return NextResponse.json({ error: "Project not found" }, { status: 404 });
      return NextResponse.json({ success: true, project: result });
    }
    if (body.action === "add-message") {
      const result = addProjectMessage(body.id, body.from, body.text);
      if (!result) return NextResponse.json({ error: "Project not found" }, { status: 404 });
      return NextResponse.json({ success: true, project: result });
    }
    const project = addProject({
      clientId: body.clientId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      projectName: body.projectName,
      status: "pending",
      description: body.description || "",
    });
    return NextResponse.json({ success: true, project });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
