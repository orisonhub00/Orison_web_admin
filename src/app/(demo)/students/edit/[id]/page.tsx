"use client";

import EditStudent from "../../editStudent";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <EditStudent
      id={id}
      onBack={() => router.push("/students")}
    />
  );
}
