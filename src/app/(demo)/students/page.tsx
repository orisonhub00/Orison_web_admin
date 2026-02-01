"use client";

import React, { Suspense } from "react";
import AllStudents from "./AllStudents";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const router = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllStudents
        onViewStudent={(id) => router.push(`/students/view/${id}`)}
        onEditStudent={(id) => router.push(`/students/edit/${id}`)}
        onAddStudent={() => router.push("/students/add")}
      />
    </Suspense>
  );
}
