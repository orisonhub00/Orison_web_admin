"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Edit2, Trash2 } from "lucide-react";
import {
  getAcademicYears,
  getAcademicYearById,
  deleteAcademicYear,
} from "@/lib/authClient";
import toast from "react-hot-toast";

interface AcademicYearType {
  id: string;
  year_name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ViewAcademicYears({
  onBack,
  onEditYear,
}: {
  onBack: () => void;
  onEditYear: (yr: AcademicYearType) => void;
}) {
  const [years, setYears] = useState<AcademicYearType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<AcademicYearType | null>(
    null
  );

  useEffect(() => {
    const fetchYears = async () => {
      setLoading(true);
      try {
        const list = await getAcademicYears();
        setYears(list);
      } catch (err: any) {
        toast.error(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  const fetchYearDetails = async (id: string) => {
    try {
      const yr = await getAcademicYearById(id);
      setSelectedYear(yr);
    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this academic year?")) return;

    try {
      await deleteAcademicYear(id);
      setYears((prev) => prev.filter((y) => y.id !== id));
      toast.success("✅ Deleted");
    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
    }
  };

  if (selectedYear) {
    return (
      <div className="w-full px-4">
        <button
          onClick={() => setSelectedYear(null)}
          className="flex items-center gap-2 text-sm text-gray-600 mb-4"
        >
          <ChevronLeft size={16} /> Back to Academic Years
        </button>

        <h2 className="text-lg font-semibold mb-4">Academic Year Details</h2>

        <div className="bg-white rounded-2xl shadow p-6 max-w-md space-y-3">
          <div>
            <span className="font-medium">Year:</span> {selectedYear.year_name}
          </div>
          <div>
            <span className="font-medium">Status:</span> {selectedYear.status}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(selectedYear.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{" "}
            {new Date(selectedYear.updatedAt).toLocaleString()}
          </div>
        </div>
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

      <h2 className="text-lg font-semibold mb-4">Academic Years</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {years.map((y) => (
            <div
              key={y.id}
              className="flex justify-between items-center bg-white rounded-2xl shadow p-4 border cursor-pointer"
              onClick={() => fetchYearDetails(y.id)}
            >
              <span>{y.year_name}</span>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditYear(y);
                  }}
                  className="text-blue-500"
                >
                  <Edit2 size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(y.id);
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
