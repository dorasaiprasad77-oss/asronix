import { NextResponse } from "next/server";
import { addBooking } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, email, businessName, service, budget, projectDescription, preferredDeadline } = body;

    if (!service || !customerName || !email || !projectDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Map form fields to storage format
    const record = addBooking({
      service,
      budget: budget || "",
      deadline: preferredDeadline || "",
      name: customerName,
      email,
      phone: phone || "",
      description: `Business: ${businessName || "Not specified"}\n\n${projectDescription}`,
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error("Booking save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
