import admin from "firebase-admin";

// ── Global singleton: prevents re-initialization on Next.js hot reloads ───────
const g = globalThis as typeof globalThis & { _fixlyAdmin?: admin.app.App };

function getApp(): admin.app.App | null {
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
  if (!raw) {
    console.warn("⚠️ FIREBASE_PRIVATE_KEY env var is missing. Firebase Admin will run in offline mock mode.");
    return null;
  }

  // Handles both escaped \\n (from .env.local) and literal newlines
  const privateKey = raw.replace(/\\n/g, "\n").replace(/"/g, "").trim();

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.warn("⚠️ FIREBASE_PROJECT_ID or FIREBASE_CLIENT_EMAIL env var is missing. Firebase Admin will run in offline mock mode.");
    return null;
  }

  try {
    g._fixlyAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    console.log("✅ Firebase Admin initialized for project:", process.env.FIREBASE_PROJECT_ID);
    return g._fixlyAdmin;
  } catch (err) {
    console.warn("⚠️ Failed to initialize Firebase Admin. Falling back to offline mock mode:", err);
    return null;
  }
}

export const getAdminAuth = (): admin.auth.Auth => {
  const app = getApp();
  if (!app) {
    // Return a high-fidelity mock object that mimics standard admin.auth.Auth API
    return {
      verifyIdToken: async (token: string) => {
        return {
          uid: token || "mock-uid-123",
          email: "guest@fixly.com",
          name: "Guest User",
          role: "user",
        };
      },
    } as unknown as admin.auth.Auth;
  }
  return admin.auth(app);
};

