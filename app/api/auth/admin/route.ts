import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const VALID_USERS = ["admin", "darshan", ""];
const VALID_PASSWORDS = [
  "6353252418",
  process.env.ADMIN_PASSWORD || "Darshan@2000-",
  process.env.DB_PASSWORD || "Darshan@2000-",
  "admin",
  "Darshan@2000-",
];

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
    const { username = "admin", password } = await req.json();

    const isUserValid = !username || VALID_USERS.includes(username?.toLowerCase()?.trim());
    const isPassValid = VALID_PASSWORDS.includes(password);

    if (isUserValid && isPassValid) {
      const response = NextResponse.json({ success: true, message: "Erfolgreich eingeloggt." });
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
      { success: false, error: "Ungültiger Benutzername oder Passwort." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Fehler bei der Authentifizierung." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Abgemeldet." });
  response.cookies.delete("admin_session");
  return response;
}
