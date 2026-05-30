import { NextResponse } from "next/server";
import { sendContactEmail, sendContactConfirmation } from "@/lib/email";
import { addContact } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Save to storage (wrapped for Vercel compatibility)
    try {
      addContact({ name, email, message });
    } catch {
      console.error("Storage save failed, but continuing");
    }

    // Send email notification to admin
    try {
      await sendContactEmail({ name, email, message });
    } catch {
      // Email is optional - don't block on failure
      console.error("Admin email notification failed, but continuing");
    }

    // Send confirmation to customer
    try {
      await sendContactConfirmation({ name, email, message });
    } catch {
      console.error("Customer confirmation email failed, but continuing");
    }

    return NextResponse.json({ success: true, message: "Message sent successfully! We'll get back to you soon." });
  } catch (error) {
    console.error("Contact API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
