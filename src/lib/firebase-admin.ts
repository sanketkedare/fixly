import admin from "firebase-admin";

// ── Global singleton: prevents re-initialization on Next.js hot reloads ───────
const g = globalThis as typeof globalThis & { _fixlyAdmin?: admin.app.App };

function getApp(): admin.app.App {
  // Return cached instance if available
  if (g._fixlyAdmin) return g._fixlyAdmin;

  // Check firebase-admin's own registry (handles concurrent calls)
  const existing = admin.apps[0];
  if (existing) {
    g._fixlyAdmin = existing;
    return g._fixlyAdmin;
  }

  // ── First-time initialization ──────────────────────────────────────────
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) throw new Error("FIREBASE_PRIVATE_KEY env var is missing");

  // Handles both escaped \\n (from .env.local) and literal newlines
  const privateKey = raw.replace(/\\n/g, "\n").replace(/"/g, "").trim();

  if (!process.env.FIREBASE_PROJECT_ID)  throw new Error("FIREBASE_PROJECT_ID env var is missing");
  if (!process.env.FIREBASE_CLIENT_EMAIL) throw new Error("FIREBASE_CLIENT_EMAIL env var is missing");

  g._fixlyAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

  console.log("✅ Firebase Admin initialized for project:", process.env.FIREBASE_PROJECT_ID);
  return g._fixlyAdmin;
}

export const getAdminAuth = (): admin.auth.Auth => admin.auth(getApp());
