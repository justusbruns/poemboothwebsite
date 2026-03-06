import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("MailerLite error:", res.status, JSON.stringify(err));
    console.error("API key present:", !!process.env.MAILERLITE_API_KEY, "length:", process.env.MAILERLITE_API_KEY?.length);
    return NextResponse.json(
      { error: (err as { message?: string })?.message || "Subscription failed", status: res.status },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
