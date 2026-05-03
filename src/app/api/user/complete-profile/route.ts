import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    // ── Auth verification ────────────────────────────────────────────────
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(token);
    const verifiedUid = decodedToken.uid;

    // ── Parse body ───────────────────────────────────────────────────────
    const { firebaseId, bio, category, address } = await request.json();

    if (!firebaseId) {
      return NextResponse.json({ error: "Missing firebaseId" }, { status: 400 });
    }

    // ── Identity guard ───────────────────────────────────────────────────
    if (firebaseId !== verifiedUid) {
      return NextResponse.json({ error: "Identity mismatch" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { firebaseId },
      { bio, category, address, isProfileComplete: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile Complete Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
