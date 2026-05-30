import { NextRequest, NextResponse } from "next/server";
import { getContacts, deleteContact } from "@/lib/storage";

export async function GET() {
  try {
    const contacts = getContacts();
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }
    const deleted = deleteContact(id);
    if (!deleted) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
