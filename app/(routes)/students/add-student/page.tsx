"use client";

import AddStudent from "@/components/Students/AddStudent";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";

const ProtectedAddStudent = withAuth(AddStudent);

export default function Page() {
  const router = useRouter();

  return (
    <ProtectedAddStudent
      onBack={() => router.back()}
      onNext={() => router.push("/students/view")}
    />
  );
}
