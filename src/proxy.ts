import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  if (isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();
  const url = new URL("/connexion", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Tout sauf la page de connexion, les fichiers statiques et le manifeste PWA
  matcher: ["/((?!connexion|_next/static|_next/image|favicon.ico|icon|manifest.webmanifest|sw.js|photos/).*)"],
};
