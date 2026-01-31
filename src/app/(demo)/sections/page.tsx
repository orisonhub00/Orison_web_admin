"use client";

import ViewSections from "./viewsections";
import { useRouter } from "next/navigation";

export default function SectionsPage() {
  const router = useRouter();

  return (
    <ViewSections
      onBack={() => router.push("/dashboard")}
      onEditSection={(sec) => router.push(`/sections/edit/${sec.id}`)}
    />
  );
}
