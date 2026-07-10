import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdsSettings, saveAdsSettings, normalizePublisherId } from "@/lib/adsSettings";

function isAuthenticated(): boolean {
  const session = cookies().get("admin_session");
  return !!session && session.value === "authenticated_secret_token_2026";
}

export async function GET() {
  const settings = await getAdsSettings();
  return NextResponse.json({ success: true, settings });
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
      slotHomepage: typeof body.slotHomepage === "string" ? body.slotHomepage : undefined,
      slotInArticle: typeof body.slotInArticle === "string" ? body.slotInArticle : undefined,
    });

    const settings = await getAdsSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Speichern fehlgeschlagen." }, { status: 500 });
  }
}
