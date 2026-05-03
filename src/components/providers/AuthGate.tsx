"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user) {
      // Check for provider onboarding
      if (
        user.role === "service_provider" && 
        !user.isProfileComplete && 
        pathname !== "/profile/complete"
      ) {
        router.push("/profile/complete");
      }
    }
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}
