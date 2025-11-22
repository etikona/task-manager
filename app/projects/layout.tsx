"use client";

import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProjectsLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, initialized, router]);

  if (!initialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProjectsLayout;
