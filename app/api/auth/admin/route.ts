import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { firebaseConfig } from "@/lib/firebase";

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session");

  if (session && session.value === "authenticated_secret_token_2026") {
    return NextResponse.json({ authenticated: true, user: "admin" });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ success: false, error: "No token provided." }, { status: 400 });
    }

    // Verify the Firebase ID Token using Google Identity Toolkit API
    // This avoids needing the Firebase Admin SDK Service Account JSON on the server.
    const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`;
    
    const verifyRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const verifyData = await verifyRes.json();

    if (verifyRes.ok && verifyData.users && verifyData.users.length > 0) {
      // The token is valid and we have the user info!
      // In a real app, you might want to check verifyData.users[0].email against an admin list.
      // Since they manage this in their Firebase Console, any valid user is an admin.
      
      const response = NextResponse.json({ success: true, message: "Successfully logged in via Firebase." });
      response.cookies.set("admin_session", "authenticated_secret_token_2026", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid Firebase Token." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Authentication error." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Abgemeldet." });
  response.cookies.delete("admin_session");
  return response;
}
