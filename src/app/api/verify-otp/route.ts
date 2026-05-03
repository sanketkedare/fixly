import { NextResponse } from "next/server";
import crypto from "crypto";

const OTP_SECRET = process.env.OTP_SECRET ?? "fixly-otp-fallback-secret-change-in-production";

export async function POST(request: Request) {
  try {
    const { ticket, otp } = await request.json() as { ticket?: string; otp?: string };

    if (!ticket || !otp) {
      return NextResponse.json({ error: "ticket and otp are required" }, { status: 400 });
    }

    // ── Re-verify ticket signature ────────────────────────────────────────
    const parts = ticket.split(".");
    if (parts.length !== 2) {
      return NextResponse.json({ error: "Invalid ticket format" }, { status: 400 });
    }

    const [payloadB64, sig] = parts;
    const expectedSig = crypto
      .createHmac("sha256", OTP_SECRET)
      .update(payloadB64)
      .digest("base64url");

    // Constant-time comparison to prevent timing attacks
    const sigValid =
      sig.length === expectedSig.length &&
      crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));

    if (!sigValid) {
      return NextResponse.json({ error: "Invalid ticket" }, { status: 401 });
    }

    // ── Decode and validate payload ───────────────────────────────────────
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString()) as {
      email: string;
      otpHash: string;
      exp: number;
    };

    if (Date.now() > payload.exp) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 410 });
    }

    // ── Verify OTP ────────────────────────────────────────────────────────
    const expectedHash = crypto
      .createHmac("sha256", OTP_SECRET)
      .update(otp + payload.email)
      .digest("hex");

    const otpValid =
      expectedHash.length === payload.otpHash.length &&
      crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(payload.otpHash));

    if (!otpValid) {
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
