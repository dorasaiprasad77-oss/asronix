import { NextResponse } from "next/server";
import { getFeedbacks, approveFeedback, deleteFeedback } from "@/lib/feedback";

export async function GET() {
  try {
    const feedbacks = getFeedbacks();
    return NextResponse.json(feedbacks);
  } catch {
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, action } = await request.json();
    if (!id || !action) {
      return NextResponse.json({ error: "ID and action required" }, { status: 400 });
    }
    if (action === "toggle-approve") {
      const result = approveFeedback(id);
      if (!result) return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
      return NextResponse.json({ success: true, feedback: result });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const deleted = deleteFeedback(id);
    if (!deleted) return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
