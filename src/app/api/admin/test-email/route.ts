import { NextResponse } from "next/server";
import {
  sendContactEmail,
  sendBookingEmail,
  sendContactConfirmation,
  sendBookingConfirmation,
} from "@/lib/email";

const TEST_CONTACT = {
  name: "Test Client",
  email: "",
  message:
    "Hi ASRONIXTECH team,\n\nI'm looking to build a modern website for my startup. We need a clean, responsive design with a blog section and contact form.\n\nCan you share your pricing and timeline for a project like this?\n\nLooking forward to hearing from you!\n\nBest,\nTest Client",
};

const TEST_BOOKING = {
  service: "Web Development",
  budget: "$2,000 - $5,000",
  deadline: "4 weeks",
  name: "Test Client",
  email: "",
  phone: "+91 98765 43210",
  description:
    "I need a full-stack web application for my e-commerce business. The platform should include:\n\n- Product catalog with search & filters\n- Shopping cart & checkout\n- Payment gateway integration\n- Admin dashboard for inventory management\n- User accounts with order history\n\nTechnology preference: Next.js + PostgreSQL\n\nLet me know if you need any additional details.",
};

export async function POST(request: Request) {
  try {
    const { type } = await request.json();

    if (!type) {
      return NextResponse.json({ error: "Missing 'type' parameter" }, { status: 400 });
    }

    const toEmail = process.env.SMTP_USER || "";
    if (!toEmail) {
      return NextResponse.json({ error: "SMTP_USER not configured" }, { status: 500 });
    }

    switch (type) {
      case "contact-admin": {
        await sendContactEmail({ ...TEST_CONTACT, email: toEmail });
        return NextResponse.json({ success: true, message: "Admin contact notification sent ✓" });
      }

      case "booking-admin": {
        await sendBookingEmail({ ...TEST_BOOKING, email: toEmail });
        return NextResponse.json({ success: true, message: "Admin booking notification sent ✓" });
      }

      case "contact-customer": {
        await sendContactConfirmation({ ...TEST_CONTACT, email: toEmail });
        return NextResponse.json({ success: true, message: "Customer contact confirmation sent ✓" });
      }

      case "booking-customer": {
        await sendBookingConfirmation({ ...TEST_BOOKING, email: toEmail });
        return NextResponse.json({ success: true, message: "Customer booking confirmation sent ✓" });
      }

      default:
        return NextResponse.json(
          { error: "Invalid type. Valid types: contact-admin, booking-admin, contact-customer, booking-customer" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send test email" },
      { status: 500 }
    );
  }
}
