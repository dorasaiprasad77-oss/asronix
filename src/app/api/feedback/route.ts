import { NextResponse } from "next/server";
import { addFeedback, getApprovedFeedbacks } from "@/lib/feedback";

export async function GET() {
  try {
    const feedbacks = getApprovedFeedbacks();
    return NextResponse.json(feedbacks);
  } catch {
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, role, review, rating, category } = body;
    if (!name || !email || !review || !rating) {
      return NextResponse.json({ error: "Name, email, review, and rating required" }, { status: 400 });
    }
    const record = addFeedback({ name, email, company: company || "", role: role || "", review, rating, category: category || "General" });
    return NextResponse.json({ success: true, message: "Thank you for your feedback! It will be visible after admin approval.", feedback: record });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
