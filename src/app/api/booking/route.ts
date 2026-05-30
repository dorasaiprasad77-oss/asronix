import { NextResponse } from "next/server";
import { sendBookingEmail, sendBookingConfirmation } from "@/lib/email";
import { addBooking } from "@/lib/storage";
import { sendBookingWhatsApp } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { service, budget, deadline, name, email, phone, description, fileData, fileName } = body;

    if (!service || !name || !email) {
      return NextResponse.json({ error: "Service, name, and email are required" }, { status: 400 });
    }

    // Save to storage (wrapped for Vercel compatibility)
    try {
      addBooking({ service, budget, deadline, name, email, phone, description, fileData, fileName });
    } catch {
      console.error("Storage save failed, but continuing");
    }

    // Send email notification to admin
    try {
      await sendBookingEmail({ service, budget, deadline, name, email, phone, description, fileData, fileName });
    } catch {
      // Email is optional - don't block on failure
      console.error("Admin email notification failed, but continuing");
    }

    // Send booking confirmation to customer
    try {
      await sendBookingConfirmation({ service, budget, deadline, name, email, phone, description });
    } catch {
      console.error("Customer confirmation email failed, but continuing");
    }

    // Send WhatsApp notification to admin
    try {
      await sendBookingWhatsApp({ service, budget, deadline, name, email, phone, description });
    } catch {
      console.error("WhatsApp notification failed, but continuing");
    }

    return NextResponse.json({ success: true, message: "Booking submitted successfully! We'll contact you within 24 hours." });
  } catch (error) {
    console.error("Booking API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
