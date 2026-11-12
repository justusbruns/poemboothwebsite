// Click target of the confirmation email. Verifies the signed token, flips the
// Resend contact to subscribed, then sends the visitor to the thank-you page.
import { confirmSignup, clientIp, SITE } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const { status, lang, region } = await confirmSignup(token, {
    ip: clientIp(request),
    userAgent: (request.headers.get("user-agent") || "").slice(0, 300),
  });
  const dest = `/${lang}/${region}/newsletter/confirmed` + (status === "ok" ? "" : `?status=${status}`);
  // Always the public host, never request.url's origin (internal behind a proxy).
  return Response.redirect(new URL(dest, SITE), 303);
}
