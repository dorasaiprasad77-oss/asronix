import { NextResponse } from "next/server";
import { sendBookingEmail, sendBookingConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, email, businessName, service, budget, projectDescription, preferredDeadline } = body;

    if (!service || !customerName || !email) {
      return NextResponse.json({ error: "Service, name, and email are required" }, { status: 400 });
    }

    // Map form fields to BookingFormData
    const bookingData = {
      service,
      budget: budget || "",
      deadline: preferredDeadline || "",
      name: customerName,
      email,
      phone: phone || "",
      description: `Business: ${businessName || "Not specified"}\n\n${projectDescription || ""}`,
    };

    const notifications: string[] = [];

    // Send email notification to admin
    try {
      await sendBookingEmail(bookingData);
      notifications.push("admin_email");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Admin email notification failed:", message);
    }

    // Send booking confirmation to customer
    try {
      await sendBookingConfirmation(bookingData);
      notifications.push("customer_email");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Customer confirmation email failed:", message);
    }

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Booking notify API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
