import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/storage";

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateSiteContent(body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
