"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Edit2, Trash2 } from "lucide-react";
import { getClassById, getClasses, deleteClass } from "@/lib/auth";

interface ClassType {
  id: string;
  class_name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ClassDetailType extends ClassType {}

export default function ViewClasses({
  onBack,
  onEditClass,
}: {
  onBack: () => void;
  onEditClass: (cls: ClassType) => void;
}) {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] =
    useState<ClassDetailType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const classList = await getClasses();
        if (Array.isArray(classList)) setClasses(classList);
        else throw new Error("Invalid API response format");
      } catch (error: any) {
        console.error(error);
        alert(`❌ Error fetching classes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const fetchClassDetails = async (id: string) => {
    setDetailLoading(true);
    try {
      const cls = await getClassById(id);
      setSelectedClass(cls);
    } catch (error: any) {
      console.error(error);
      alert(`❌ ${error.message}`);
    } finally {
      setDetailLoading(false);
    }
  };

  // ✅ Updated handleDelete to call API
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      setLoading(true);
      await deleteClass(id); // call API
      setClasses((prev) => prev.filter((cls) => cls.id !== id)); // update UI
      alert("✅ Class deleted successfully");
    } catch (error: any) {
      console.error(error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackFromDetail = () => {
    setSelectedClass(null);
  };

  if (selectedClass) {
    return (
      <div className="w-full px-4">
        <button
          onClick={handleBackFromDetail}
          className="flex items-center gap-2 text-sm text-gray-600 mb-4"
        >
          <ChevronLeft size={16} /> Back to Classes
        </button>

        <h2 className="text-lg font-semibold mb-4">Class Details</h2>

        {detailLoading ? (
          <div className="text-gray-500">Loading class details...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md space-y-3">
            <div>
              <span className="font-medium text-gray-700">Class Name: </span>
              {selectedClass.class_name}
            </div>
            <div>
              <span className="font-medium text-gray-700">Status: </span>
              {selectedClass.status}
            </div>
            <div>
              <span className="font-medium text-gray-700">Created At: </span>
              {new Date(selectedClass.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium text-gray-700">Updated At: </span>
              {new Date(selectedClass.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h2 className="text-lg font-semibold mb-4">All Classes</h2>

      {loading ? (
        <div className="text-gray-500">Loading classes...</div>
      ) : (
        <div className="space-y-3">
          {classes.length > 0 ? (
            classes.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center w-full bg-white rounded-2xl shadow p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => fetchClassDetails(c.id)}
              >
                <span className="text-gray-700 font-medium">{c.class_name}</span>

                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClass(c);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id); // call API
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No classes found</div>
          )}
        </div>
      )}
    </div>
  );
}
