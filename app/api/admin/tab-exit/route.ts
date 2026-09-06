import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scheduleTabExit } from "@/lib/supabase/admin-session";

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

    const finalTabId = tabId || "admin-tab";
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Schedule best-effort signout if not cancelled by a reload within grace period
      scheduleTabExit(finalTabId, supabase, 3000);
    }

    return NextResponse.json({ success: true, scheduled: Boolean(user) });
  } catch (err) {
    console.error("[api/admin/tab-exit] Error handling tab exit:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
