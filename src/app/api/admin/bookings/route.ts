import { NextRequest, NextResponse } from "next/server";
import { getBookings, deleteBooking } from "@/lib/storage";

export async function GET() {
  try {
    const bookings = getBookings();
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }
    const deleted = deleteBooking(id);
    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
