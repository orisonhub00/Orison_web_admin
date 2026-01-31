"use client";

import StudentDataScreen from "../studentdata";
import { useRouter } from "next/navigation";

export default function AddStudentPage() {
  const router = useRouter();

  return (
    <StudentDataScreen 
      onBack={() => router.push("/students")} 
    />
  );
}
