"use client";
import { useAppSelector } from "@/hooks/redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      document.cookie = "is-authenticated=true; path=/; max-age=86400";
    } else {
      document.cookie = "is-authenticated=false; path=/; max-age=0";
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/teams", "/projects", "/tasks"];
    const authRoutes = ["/login", "/register"];

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname?.startsWith(route)
    );
    const isAuthRoute = authRoutes.includes(pathname || "");

    if (isProtectedRoute && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthRoute && isAuthenticated) {
      router.push("/dashboard");
      return;
    }
  }, [pathname, isAuthenticated, router]);

  return <>{children}</>;
};

export default ClientLayout;
