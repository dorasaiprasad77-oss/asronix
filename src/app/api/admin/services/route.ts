import { NextRequest, NextResponse } from "next/server";
import { getServices, addService, updateService, deleteService } from "@/lib/storage";

export async function GET() {
  try {
    const items = getServices();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!data.title) {
      return NextResponse.json({ error: "Service title is required" }, { status: 400 });
    }

    if (id) {
      const updated = updateService(id, data);
      if (!updated) return NextResponse.json({ error: "Service not found" }, { status: 404 });
      return NextResponse.json(updated);
    } else {
      const item = addService({
        title: data.title,
        description: data.description || "",
        icon: data.icon || "Globe",
        gradient: data.gradient || "from-blue-500 to-purple-500",
        items: data.items || [],
        price: data.price || "",
        featured: data.featured || false,
      });
      return NextResponse.json(item);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to save service" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    const deleted = deleteService(id);
    if (!deleted) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
