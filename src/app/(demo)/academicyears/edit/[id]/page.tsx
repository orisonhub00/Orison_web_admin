"use client";

import CreateAcademicYear from "../../CreateAcademicYear";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
// Assuming API function exists
import { getAcademicYearById } from "@/lib/authClient"; 

export default function EditAcademicYearPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [year, setYear] = useState(null);

  useEffect(() => {
     getAcademicYearById(id).then(setYear);
  }, [id]);

  if (!year) return <div className="p-6">Loading...</div>;

  return (
    <CreateAcademicYear
      onBack={() => router.push("/academicyears")}
      editingYear={year}
    />
  );
}
