"use client";

import React, { useEffect, useState } from "react";
import { Search, Eye, Pencil, Plus } from "lucide-react";
import { BASE_URL } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

interface AllStudentsProps {
  onViewStudent: (id: string) => void;
  onEditStudent: (id: string) => void;
  onAddStudent: () => void;
}

type Student = {
  id: string;
  name: string;
  admission_no: string;

  class: {
    id: string;
    class_name: string;
  } | null;

  section: {
    id: string;
    section_name: string;
  } | null;
};


export default function AllStudents({
  onViewStudent,
  onEditStudent,
  onAddStudent,
}: AllStudentsProps) {
  /* ================= STATE ================= */
  
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;

  /* ================= FETCH ================= */

  const fetchStudents = async () => {
    const res = await fetch(
      `${BASE_URL}/api/v1/students?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setStudents(data.students);
      setTotal(data.total);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl px-6 py-4 shadow-sm border">
        <h2 className="text-[15px] font-semibold text-[#ff6b35]">
          Students
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="pl-9 pr-3 py-2 rounded-lg border text-[12px]"
            />
          </div>

          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 px-4 py-2 text-[12px] rounded-lg bg-[#ff6b35] text-white"
          >
            <Plus size={14} />
            Add New Student
          </button>
        </div>
      </div>

      {/* Table */}
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
                    onClick={() => router.push(`/students/edit/${student.id}`)}
                    className="text-gray-500 hover:text-[#ff6b35]"
                  >
                    <Pencil size={14} />
                  </button>

                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => onViewStudent(student.id)}
                    className="text-gray-500 hover:text-[#ff6b35]"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}

            {!students.length && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t text-[11px]">
          <span>
            Showing {students.length} of {total}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-[#ff6b35] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
