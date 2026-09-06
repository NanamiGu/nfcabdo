import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    cancelTabExit(tabId);

    const supabase = await createClient();
    await supabase.auth.signOut();

    const response = NextResponse.json({ success: true });

    // Explicitly delete Supabase auth cookies on response
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.includes("auth-token") || cookie.name.startsWith("sb-")) {
        response.cookies.delete(cookie.name);
      }
    });

    return response;
  } catch (err) {
    console.error("[api/admin/logout] Error during logout:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
