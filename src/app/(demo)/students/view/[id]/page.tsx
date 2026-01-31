"use client";

import ViewStudent from "../../ViewStudent";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ViewStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <ViewStudent
      studentId={id}
      onBack={() => router.push("/students")}
    />
  );
}
