import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ── Stateless OTP: HMAC-signed ticket (Vercel-compatible, no Redis needed) ────
const OTP_SECRET = process.env.OTP_SECRET ?? "fixly-otp-secret-change-in-production";
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MS = 60 * 1000;   // 60s cooldown per email

const rateLimitStore = new Map<string, number>();

function generateOTP(): string {
  return String(crypto.randomInt(100000, 999999));
}

function signTicket(email: string, otp: string): string {
  const exp = Date.now() + OTP_TTL_MS;
  const otpHash = crypto
    .createHmac("sha256", OTP_SECRET)
    .update(otp + email)
    .digest("hex");

  const payload = Buffer.from(JSON.stringify({ email, otpHash, exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

// ── Gmail transporter (reused across requests in the same instance) ───────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json() as { email?: string; name?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // ── Rate limiting ─────────────────────────────────────────────────────
    const lastSent = rateLimitStore.get(email) ?? 0;
    if (Date.now() - lastSent < RATE_LIMIT_MS) {
      const wait = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastSent)) / 1000);
      return NextResponse.json(
        { error: `Please wait ${wait}s before requesting another OTP` },
        { status: 429 }
      );
    }

    const otp = generateOTP();
    const ticket = signTicket(email, otp);
    rateLimitStore.set(email, Date.now());

    // ── Send via Gmail (Nodemailer) ───────────────────────────────────────
    await transporter.sendMail({
      from: `"Fixly Verification" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Fixly — Verify Your Account",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:16px;">
          <h2 style="color:#2563eb;font-weight:900;font-size:24px;margin-bottom:16px;">Welcome to Fixly!</h2>
          <p style="color:#4b5563;font-size:16px;margin-bottom:24px;">
            Hi ${name ?? "there"}, use the code below to verify your account.
          </p>
          <div style="background:#eff6ff;padding:28px;text-align:center;border-radius:16px;border:1px solid #dbeafe;">
            <span style="font-size:36px;font-weight:900;letter-spacing:10px;color:#1e40af;">${otp}</span>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
            This code expires in 10 minutes. If you didn't request this, ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
  }
}
