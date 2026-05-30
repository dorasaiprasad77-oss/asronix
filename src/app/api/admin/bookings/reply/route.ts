import { NextRequest, NextResponse } from "next/server";
import { sendAdminReply } from "@/lib/email";
import { getReplies, addReply } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get("bookingId");
    const contactId = request.nextUrl.searchParams.get("contactId");
    if (!bookingId && !contactId) {
      return NextResponse.json({ error: "Provide bookingId or contactId query parameter" }, { status: 400 });
    }
    const replies = getReplies(bookingId || undefined, contactId || undefined);
    return NextResponse.json(replies);
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bookingId, name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
        { status: 400 }
      );
    }

    await sendAdminReply({ name, email, subject, message });

    // Save to reply history
    if (bookingId) {
      addReply({ bookingId, name, email, subject, message });
    }

    return NextResponse.json({ success: true, message: "Reply sent successfully!" });
  } catch (error) {
    console.error("Failed to send admin reply:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send reply" },
      { status: 500 }
    );
  }
}
