import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAdminAuth } from "@/lib/firebase-admin";

// ── Token verification helper ─────────────────────────────────────────────────
async function verifyToken(request: Request): Promise<{ uid: string } | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1].trim();
    const decoded = await getAdminAuth().verifyIdToken(token);
    return { uid: decoded.uid };
  } catch (err) {
    // Log the real reason for diagnosis — visible in `npm run dev` terminal
    console.error("🔴 verifyToken failed:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

const MOCK_DB_USER = {
  firebaseId: "mock-uid-123",
  email: "guest@fixly.com",
  name: "Guest User",
  role: "user",
  mobile: "9876543210",
  isProfileComplete: true,
  bio: "This is a mock offline user bio.",
  address: "123 Mock Street, Offline City",
  rating: 4.8,
  createdAt: new Date().toISOString()
};

// ── GET /api/user?firebaseId=xxx ──────────────────────────────────────────────
export async function GET(request: Request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(MOCK_DB_USER);
  }

  const verified = await verifyToken(request);
  if (!verified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const firebaseId = searchParams.get("firebaseId");

  if (!firebaseId) {
    return NextResponse.json({ error: "Missing firebaseId" }, { status: 400 });
  }

  if (verified.uid !== firebaseId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ firebaseId }).select(
      "firebaseId email name role mobile isProfileComplete bio category address rating createdAt"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/user DB error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// ── POST /api/user (create or merge user record) ─────────────────────────────
export async function POST(request: Request) {
  if (!process.env.MONGODB_URI) {
    try {
      const body = await request.json();
      return NextResponse.json({ ...MOCK_DB_USER, ...body }, { status: 201 });
    } catch {
      return NextResponse.json(MOCK_DB_USER, { status: 201 });
    }
  }

  // ── 1. Auth header check ──────────────────────────────────────────────────
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Verify token — return 401 on failure (not 500) ────────────────────
  let verifiedUid: string;
  try {
    const token = authHeader.split(" ")[1].trim();
    const decoded = await getAdminAuth().verifyIdToken(token);
    verifiedUid = decoded.uid;
  } catch (err) {
    console.error("🔴 POST /api/user token verification failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "Token verification failed" }, { status: 401 });
  }

  // ── 3. Parse body ─────────────────────────────────────────────────────────
  try {
    const body = await request.json();
    const { firebaseId, email, name, role, mobile } = body as {
      firebaseId: string;
      email: string;
      name: string;
      role: string;
      mobile?: string;
    };

    console.log("📥 Syncing User:", { email, role, firebaseId });

    // Identity guard
    if (firebaseId !== verifiedUid) {
      console.error("❌ Identity mismatch:", { firebaseId, verifiedUid });
      return NextResponse.json({ error: "Identity mismatch" }, { status: 403 });
    }

    // Block client-side admin elevation
    const finalRole = role === "admin" ? "user" : role;

    await connectDB();

    // Account merging: match on firebaseId OR email
    let user = await User.findOne({ $or: [{ firebaseId }, { email }] });

    if (!user) {
      console.log("✨ Creating new user record...");
      user = await User.create({
        firebaseId,
        email,
        name,
        role: finalRole || "user",
        mobile,
        isProfileComplete: false,
      });
    } else {
      console.log("🔄 Merging existing user record...");
      if (user.firebaseId !== firebaseId) user.firebaseId = firebaseId;
      if (name) user.name = name;
      if (mobile) user.mobile = mobile;
      // NOTE: role is NOT updated on merge — preserves role set at first registration
      await user.save();
    }

    console.log("✅ User sync successful for:", email);
    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ POST /api/user DB error:", message);
    return NextResponse.json({ error: "Failed to sync user", details: message }, { status: 500 });
  }
}
