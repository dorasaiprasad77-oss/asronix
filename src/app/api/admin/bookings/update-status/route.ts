import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }
    const validStatuses = ["new", "in-progress", "completed", "cancelled"] as const;
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }
    const result = updateBookingStatus(id, status);
    if (!result) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking: result });
  } catch {
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
