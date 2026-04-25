"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { currentUser, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/welcome");
      } else if (userProfile) {
        // RBAC Check
        if (adminOnly && userProfile.role !== "admin") {
          router.push("/");
        }
      }
    }
  }, [currentUser, userProfile, loading, router, pathname, adminOnly]);

  // Show loading spinner while auth resolves or if a redirect is happening
  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-primary-container shadow-[0_0_15px_rgba(0,240,255,0.5)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container animate-pulse">bolt</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
