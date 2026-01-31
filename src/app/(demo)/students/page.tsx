"use client";

import AllStudents from "./AllStudents";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const router = useRouter();

  return (
    <AllStudents
      onViewStudent={(id) => router.push(`/students/view/${id}`)}
      onEditStudent={(id) => router.push(`/students/edit/${id}`)}
      onAddStudent={() => router.push("/students/add")}
    />
  );
}
