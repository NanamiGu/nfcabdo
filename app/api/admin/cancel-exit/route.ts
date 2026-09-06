import { NextResponse, type NextRequest } from "next/server";
import { cancelTabExit } from "@/lib/supabase/admin-session";

export async function POST(request: NextRequest) {
  try {
    let tabId: string | undefined;
    try {
      const text = await request.text();
      if (text) {
        const body = JSON.parse(text);
        tabId = body?.tabId;
      }
    } catch {
      // payload could be malformed or empty
    }

    const cancelled = cancelTabExit(tabId);

    return NextResponse.json({ success: true, cancelled });
  } catch (err) {
    console.error("[api/admin/cancel-exit] Error canceling exit:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
