import { NextRequest, NextResponse } from "next/server";
import { sendAdminReply } from "@/lib/email";
import { addReply } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { contactId, name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, subject, message" },
        { status: 400 }
      );
    }

    await sendAdminReply({ name, email, subject, message });

    // Save to reply history
    if (contactId) {
      addReply({ contactId, name, email, subject, message });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact reply error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send reply" },
      { status: 500 }
    );
  }
}
