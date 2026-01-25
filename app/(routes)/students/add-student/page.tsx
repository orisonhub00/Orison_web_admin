
"use client";

import AddStudent from "@/components/Students/AddStudent";


import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <AddStudent
      onBack={() => router.back()}
      onNext={() => router.push("/students/view")}
    />
  );
}
