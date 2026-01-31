"use client";

import CreateClass from "../createclass";
import { useRouter } from "next/navigation";

export default function CreateClassPage() {
  const router = useRouter();

  return (
    <CreateClass
      onBack={() => router.push("/classes")}
      editingClass={null}
    />
  );
}
