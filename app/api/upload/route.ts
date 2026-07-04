import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with user's product environment credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "diuy76wgh",
  api_key: process.env.CLOUDINARY_API_KEY || "814445141538594",
  api_secret: process.env.CLOUDINARY_API_SECRET || "0a8YgYkQCGlGUM_4KHCygGjFVzU",
  secure: true,
});

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("admin_session");
    if (!session || session.value !== "authenticated_secret_token_2026") {
      return NextResponse.json({ error: "Nicht autorisiert. Bitte im Admin Center einloggen." }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let fileUri = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "Keine Datei hochgeladen." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/png";
      fileUri = `data:${mimeType};base64,${base64}`;
    } else {
      const body = await req.json();
      if (!body.image && !body.file) {
        return NextResponse.json({ error: "Kein Bild angegeben." }, { status: 400 });
      }
      fileUri = body.image || body.file;
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(fileUri, {
      folder: "bruttonetto_blog",
      resource_type: "auto",
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url || uploadResult.url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error: any) {
    console.error("❌ Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Hochladen zu Cloudinary.", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
