"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store";
import { authService } from "@/services";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setAuth, logout } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function init() {
      // Already hydated from persist — redirect off login
      if (user && pathname === "/admin/login") {
        router.replace("/admin/dashboard");
        setChecking(false);
        return;
      }

      try {
        const res = await authService.verify();
        if (res.valid) {
          if (!user) {
            setAuth({
              id: res.user.id,
              name: res.user.name || res.user.email,
              email: res.user.email,
              role: res.user.role,
            });
          }
          if (pathname === "/admin/login") {
            router.replace("/admin/dashboard");
          }
        } else {
          logout();
          if (pathname !== "/admin/login") router.replace("/admin/login");
        }
      } catch {
        if (!user && pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
      } finally {
        setChecking(false);
      }
    }

    init();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-mega-blue border-t-transparent rounded-full animate-spin" />
          <p className="font-inter text-sm text-gray-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login" && !user) {
    return <>{children}</>;
  }

  if (pathname !== "/admin/login" && !user) {
    return null;
  }

  return <>{children}</>;
}
