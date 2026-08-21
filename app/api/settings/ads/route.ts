import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdsSettings, saveAdsSettings, normalizePublisherId } from "@/lib/adsSettings";

// Force dynamic rendering — this route reads from the database at runtime
export const dynamic = "force-dynamic";

function isAuthenticated(): boolean {
  const session = cookies().get("admin_session");
  return !!session && session.value === "authenticated_secret_token_2026";
}

export async function GET() {
  try {
    const settings = await getAdsSettings();
    // Cached: this is hit on every single page view, and it only carries the
    // ads on/off switch now that the AdSense loader ships statically in the
    // layout. Without a cache header every visitor cost a MySQL round-trip.
    // A few minutes of staleness on an admin toggle is fine.
    return NextResponse.json(
      { success: true, settings },
      { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } }
    );
  } catch (err: any) {
    console.error("Failed to load ads settings:", err?.message);
    return NextResponse.json({ success: false, error: "Failed to load settings." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ success: false, error: "Nicht autorisiert." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const publisherId = typeof body.publisherId === "string" ? normalizePublisherId(body.publisherId) : undefined;

    if (publisherId && !/^pub-\d{10,20}$/.test(publisherId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Publisher-ID. Format: pub-XXXXXXXXXXXXXXXX" },
        { status: 400 }
      );
    }

    await saveAdsSettings({
      enabled: typeof body.enabled === "boolean" ? body.enabled : undefined,
      publisherId,
      autoAds: typeof body.autoAds === "boolean" ? body.autoAds : undefined,
    });

    const settings = await getAdsSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
