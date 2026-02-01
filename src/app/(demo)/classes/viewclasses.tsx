"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Edit2, Trash2 } from "lucide-react";
import { getClassById, getClasses, deleteClass } from "@/lib/authClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



interface ClassType {
  id: string;
  class_name: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  section_count?: number;
  student_count?: number;
}

export default function ViewClasses({
  onBack,
  onEditClass,
}: {
  onBack: () => void;
  onEditClass: (cls: ClassType) => void;
}) {
  const router = useRouter(); // Initialize router
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  /* ---------- FETCH CLASSES ---------- */
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const { classes: classesData } = await getClasses();
        setClasses(
          classesData.map((c: ClassType) => ({
            ...c,
            status: c.status || "active",
          }))
        );
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
    
  }, []);

  /* ---------- FETCH DETAILS ---------- */
  const fetchClassDetails = async (id: string) => {
    setDetailLoading(true);
    try {
      const cls = await getClassById(id);
      setSelectedClass({ ...cls, status: cls.status || "active" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDetailLoading(false);
    }
  };

  /* ---------- HANDLE CLICK ---------- */
  const handleClassClick = (cls: ClassType) => {
    // If no sections but students exist, go to student list directly
    if ((cls.section_count === 0 || !cls.section_count) && ((cls.student_count || 0) > 0)) {
       toast("No section available in this class. Showing students...", { icon: "ℹ️" });
       router.push(`/students?class_id=${cls.id}`);
       return;
    }
    // Default behavior
    fetchClassDetails(cls.id);
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await deleteClass(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
      toast.success("Class deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  /* ===================== DETAIL VIEW ===================== */
  if (selectedClass) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4">
        <button
          onClick={() => setSelectedClass(null)}
          className="flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-black"
        >
          <ChevronLeft size={16} /> Back to Classes
        </button>

        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Class Details</h2>
          </div>

          {detailLoading ? (
            <div className="p-6 text-gray-500">Loading details...</div>
          ) : (
            <div className="divide-y">
              {[
                ["Class Name", selectedClass.class_name],
                [
                  "Status",
                  <span
                    key="status"
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedClass.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {selectedClass.status}
                  </span>,
                ],
                [
                  "Created At",
                  new Date(selectedClass.createdAt).toLocaleString(),
                ],
                [
                  "Updated At",
                  new Date(selectedClass.updatedAt).toLocaleString(),
                ],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-4 px-6 py-4 text-sm"
                >
                  <div className="text-gray-500 font-medium">{label}</div>
                  <div className="col-span-2 text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ===================== LIST VIEW ===================== */
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-black"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">All Classes</h2>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="p-6 text-gray-500">No classes found</div>
        ) : (
          <div className="divide-y">
            {/* HEADER */}
            <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-500 bg-gray-50">
              <div className="col-span-2">CLASS NAME</div>
              <div>STATUS</div>
              <div>UPDATED</div>
              <div className="text-right">ACTIONS</div>
            </div>

            {/* ROWS */}
            {classes.map((c) => (
              <div
                key={c.id}
                onClick={() => handleClassClick(c)}
                className="grid grid-cols-5 px-6 py-4 items-center text-sm hover:bg-gray-50 cursor-pointer"
              >
                <div className="col-span-2 font-medium text-gray-900">
                  {c.class_name}
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="text-gray-600">
                  {new Date(c.updatedAt).toLocaleDateString()}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClass(c);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
