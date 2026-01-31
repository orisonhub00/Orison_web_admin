"use client";

import CreateClass from "../../createclass";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getClassById } from "@/lib/authClient";

export default function EditClassPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [cls, setCls] = useState(null);

  useEffect(() => {
     getClassById(id).then(setCls);
  }, [id]);

  if (!cls) return <div className="p-6">Loading...</div>;

  return (
    <CreateClass
      onBack={() => router.push("/classes")}
      editingClass={cls}
    />
  );
}
