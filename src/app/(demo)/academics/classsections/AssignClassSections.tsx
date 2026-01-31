"use client";

import { useEffect, useState } from "react";
import { useClasses } from "@/lib/hooks/useClasses";
import { useSections } from "@/lib/hooks/useSections";
import toast from "react-hot-toast";

// import {
//   assignSectionsToClass,
//   getSectionsByClass,
//   GetSectionsByClassResponse,
// } from "@/lib/hooks/useClassSections";


import {
  assignSectionsToClass,
  getSectionsByClass,
  GetSectionsByClassResponse,
} from "@/lib/authClient";


interface ClassType {
  id: string;
  class_name: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface SectionType {
  id: string;
  section_name: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export default function AssignClassSections() {
  const { classes } = useClasses() as { classes: ClassType[] };
  const { sections } = useSections() as { sections: SectionType[] };

  const [classId, setClassId] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);



  
  // Fetch assigned sections when classId changes
  useEffect(() => {
    if (!classId) {
      setSelectedSections([]);
      return;
    }
    setLoading(true);
    getSectionsByClass(classId)
      .then((res: GetSectionsByClassResponse) => {
        // API returns { sections: SectionType[] }
        setSelectedSections(res.sections?.map((s: SectionType) => s.id) || []);
      })
      .finally(() => setLoading(false));
  }, [classId]);

//   const toggleSection = (id: string) => {
//     setSelectedSections((prev) =>
//       prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
//     );
//   };


const toggleSection = (id: string) => {
  setSelectedSections((prev) => {
    const set = new Set(prev);
    set.has(id) ? set.delete(id) : set.add(id);
    return Array.from(set);
  });
};


  const handleSave = async () => {
    setLoading(true);
    await assignSectionsToClass(classId, selectedSections);
    setLoading(false);
    toast.success("Sections assigned successfully");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Assign Sections to Class</h2>

      {/* Class Select */}
      <select
        className="border p-2 rounded w-full mb-4"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.class_name}
          </option>
        ))}
      </select>

      {/* Sections */}
      <div className="grid grid-cols-3 gap-3">
        {sections.map((sec) => (
          <label key={sec.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedSections.includes(sec.id)}
              onChange={() => toggleSection(sec.id)}
              disabled={loading}
            />
            {sec.section_name}
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={!classId || selectedSections.length === 0 || loading}
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
      >
        {loading ? "Saving..." : "Assign Sections"}
      </button>
    </div>
  );
}
