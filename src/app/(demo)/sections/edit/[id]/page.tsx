"use client";

import CreateSection from "../../addsection";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
// Assuming getSectionById exists in authClient roughly similar to getClassById
import { getSectionById } from "@/lib/authClient"; 

export default function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [section, setSection] = useState(null);

  useEffect(() => {
     getSectionById(id).then(setSection);
  }, [id]);

  if (!section) return <div className="p-6">Loading...</div>;

  return (
    <CreateSection
      onBack={() => router.push("/sections")}
      editingSection={section}
    />
  );
}
