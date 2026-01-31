"use client";

import CreateSection from "../addsection";
import { useRouter } from "next/navigation";

export default function CreateSectionPage() {
  const router = useRouter();

  return (
    <CreateSection
      onBack={() => router.push("/sections")}
      editingSection={null}
    />
  );
}
