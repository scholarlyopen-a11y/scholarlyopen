import { NextResponse } from "next/server"

interface UnsubscribeRecord {
  email: string
  journal?: string
  timestamp: string
  reason?: string
}

// In-memory fallback cache for development/serverless session
let unsubscribedMemoryStore: UnsubscribeRecord[] = []

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = (searchParams.get("email") || "").trim().toLowerCase()
  const journal = searchParams.get("journal") || "All Journals"
  const format = searchParams.get("format")

  if (format === "json") {
    return NextResponse.json({
      success: true,
      unsubscribed: unsubscribedMemoryStore
    })
  }

  if (email) {
    if (!unsubscribedMemoryStore.some(u => u.email === email)) {
      unsubscribedMemoryStore.push({
        email,
        journal,
        timestamp: new Date().toISOString(),
        reason: "User unsubscribed via email link"
      })
    }

    // Return HTML confirmation page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe Confirmation - Scholarly Open</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 40px 20px; display: flex; align-items: center; justify-content: center; min-height: 80vh; }
    .card { max-width: 520px; width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 36px 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); text-align: center; }
    .icon { width: 54px; height: 54px; border-radius: 50%; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 20px auto; }
    h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; }
    p { font-size: 14px; line-height: 1.6; color: #64748b; margin: 0 0 20px 0; }
    .highlight { background: #f1f5f9; border-radius: 8px; padding: 10px 14px; font-family: monospace; font-size: 13px; color: #334155; display: inline-block; margin-bottom: 24px; word-break: break-all; }
    .btn { display: inline-block; background: #0b99ff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; }
    .footer { font-size: 11px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 18px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <h1>You Have Been Unsubscribed</h1>
    <p>Your email address has been removed from future editorial invitations and calls for papers for <strong>${journal}</strong>.</p>
    <div class="highlight">${email}</div>
    <div>
      <a href="https://www.scholarlyopen.org" class="btn">Return to Scholarly Open</a>
    </div>
    <div class="footer">
      Scholarly Open Publishing Group • Basel / London<br>
      Adhering to COPE Ethical Standards & CAN-SPAM / GDPR Regulations
    </div>
  </div>
</body>
</html>`

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    })
  }

  return NextResponse.json({
    success: true,
    unsubscribed: unsubscribedMemoryStore
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = (body.email || "").trim().toLowerCase()
    const journal = body.journal || "All Journals"
    const reason = body.reason || "Manual opt-out by Journal Manager"

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    if (body.action === "remove") {
      unsubscribedMemoryStore = unsubscribedMemoryStore.filter(u => u.email !== email)
      return NextResponse.json({ success: true, action: "removed", email })
    }

    if (!unsubscribedMemoryStore.some(u => u.email === email)) {
      unsubscribedMemoryStore.push({
        email,
        journal,
        timestamp: new Date().toISOString(),
        reason
      })
    }

    return NextResponse.json({
      success: true,
      action: "added",
      record: { email, journal, reason, timestamp: new Date().toISOString() }
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
