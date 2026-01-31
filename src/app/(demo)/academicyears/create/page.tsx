"use client";

import CreateAcademicYear from "../CreateAcademicYear";
import { useRouter } from "next/navigation";

export default function CreateAcademicYearPage() {
  const router = useRouter();

  return (
    <CreateAcademicYear
      onBack={() => router.push("/academicyears")}
      editingYear={null}
    />
  );
}
