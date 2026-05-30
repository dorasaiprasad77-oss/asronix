import { NextRequest, NextResponse } from "next/server";
import { getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "@/lib/storage";

export async function GET() {
  try {
    const items = getPortfolioItems();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!data.title || !data.client) {
      return NextResponse.json({ error: "Title and client are required" }, { status: 400 });
    }

    if (id) {
      const updated = updatePortfolioItem(id, data);
      if (!updated) {
        return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
      }
      return NextResponse.json(updated);
    } else {
      const item = addPortfolioItem({
        title: data.title,
        client: data.client,
        industry: data.industry || "",
        description: data.description || "",
        technologies: data.technologies || [],
        image: data.image || "/placeholder.svg",
        gradient: data.gradient || "from-gray-500 to-gray-600",
        featured: data.featured || false,
      });
      return NextResponse.json(item);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to save portfolio item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Portfolio item ID is required" }, { status: 400 });
    }
    const deleted = deletePortfolioItem(id);
    if (!deleted) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}
