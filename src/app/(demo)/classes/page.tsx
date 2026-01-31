"use client";

import ViewClasses from "./viewclasses";
import { useRouter } from "next/navigation";

export default function ClassesPage() {
  const router = useRouter();

  return (
    <ViewClasses
      onBack={() => router.push("/dashboard")}
      onEditClass={(cls) => router.push(`/classes/edit/${cls.id}`)}
    />
  );
}
