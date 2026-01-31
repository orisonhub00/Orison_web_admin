"use client";

import ViewAcademicYears from "./ViewAcademicYears";
import { useRouter } from "next/navigation";

export default function AcademicYearsPage() {
  const router = useRouter();

  return (
    <ViewAcademicYears
      onBack={() => router.push("/dashboard")}
      onEditYear={(yr) => router.push(`/academicyears/edit/${yr.id}`)}
    />
  );
}
