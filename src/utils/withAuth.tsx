"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAdminToken } from "../lib/getToken";
import React from "react";

export default function withAuth<P extends Record<string, any>>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    useEffect(() => {
      const token = getAdminToken();
      if (!token) {
        router.replace("/login");
      }
    }, [router]);
    return <Component {...props} />;
  };
}
