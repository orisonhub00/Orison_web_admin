"use client";

import React, { useEffect, useState } from "react";
import { Search, Eye, Pencil, Plus } from "lucide-react";
import { BASE_URL, getClasses, getSectionsByClass } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

type ClassType = {
  id: string;
  class_name: string;
};

type AllStudentsProps = {
  onViewStudent: (studentId: string) => void;
  onEditStudent: (studentId: string) => void;
  onAddStudent: () => void;
};

type SectionType = {
  id: string;
  section_name: string;
};

type Student = {
  id: string;
  name: string;
  admission_no: string;
  class: { id: string; class_name: string } | null;
  section: { id: string; section_name: string } | null;
};

export default function AllStudents({
  onViewStudent,
  onEditStudent,
  onAddStudent,
}: AllStudentsProps) {
  const router = useRouter();

  /* ================= STATE ================= */

  const [classes, setClasses] = useState<ClassType[]>([]);
  const [sections, setSections] = useState<SectionType[]>([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // ⭐ important

  const limit = 10;

  /* ================= INIT ================= */

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  /* ================= FETCH SECTIONS ================= */

  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection("");
      return;
    }

    getSectionsByClass(selectedClass)
      .then((res) => setSections(res.sections || []))
      .catch(() => setSections([]));
  }, [selectedClass]);

  /* ================= FETCH STUDENTS ================= */

  const fetchStudents = async () => {
    if (!selectedClass || !selectedSection) return;

    setLoading(true);
    setSearched(true);

    const res = await fetch(
      `${BASE_URL}/api/v1/students?class_id=${selectedClass}&section_id=${selectedSection}&page=${page}&limit=${limit}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success("Students fetched successfully");
      setStudents(data.students || []);
      setTotal(data.total || 0);
    } else {
      setStudents([]);
      setTotal(0);
    }

    setLoading(false);
  };

  /* ================= REFETCH ON PAGE / SEARCH ================= */

  useEffect(() => {
    if (searched) {
      fetchStudents();
    }
  }, [page, search]);

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl px-6 py-4 border">
        <h2 className="text-[15px] font-semibold text-[#ff6b35]">
          Students
        </h2>

        <button
          onClick={onAddStudent}
          className="flex items-center gap-2 px-4 py-2 text-[12px] rounded-lg bg-[#ff6b35] text-white"
        >
          <Plus size={14} />
          Add New Student
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="mt-4 bg-white rounded-xl p-4 border grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setPage(1);
            setStudents([]);
            setSearched(false);
          }}
          className="border rounded-lg px-3 py-2 text-[12px]"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.class_name}
            </option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e) => {
            setSelectedSection(e.target.value);
            setPage(1);
          }}
          disabled={!sections.length}
          className="border rounded-lg px-3 py-2 text-[12px]"
        >
          <option value="">Select Section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.section_name}
            </option>
          ))}
        </select>

        <button
          onClick={fetchStudents}
          disabled={!selectedClass || !selectedSection}
          className="bg-[#ff6b35] text-white rounded-lg text-[12px]"
        >
          Search Students
        </button>

        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="pl-8 pr-3 py-2 rounded-lg border text-[12px] w-full"
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="mt-4 bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Sr</th>
              <th className="px-4 py-3 text-left">Student Name</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Section</th>
              <th className="px-4 py-3 text-left">Edit</th>
              <th className="px-4 py-3 text-left">View</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {students.map((student, index) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="px-4 py-3">{student.name}</td>
                <td className="px-4 py-3">
                  {student.class?.class_name || "-"}
                </td>
                <td className="px-4 py-3">
                  {student.section?.section_name || "-"}
                </td>
                <td className="px-4 py-3">
  <button
    onClick={() => {
      onEditStudent(student.id); // pass the student ID
    }}
  >
    <Pencil size={14} />
  </button>
</td>

                <td className="px-4 py-3">
                  <button onClick={() => onViewStudent(student.id)}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {/* ✅ EMPTY STATE */}
            {!loading && searched && students.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No students found for this class & section
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
