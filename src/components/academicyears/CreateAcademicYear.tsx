"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { createAcademicYear, updateAcademicYear } from "@/lib/authClient";

export default function CreateAcademicYear({
  onBack,
  editingYear,
}: {
  onBack: () => void;
  editingYear: { id: string; year_name: string; status: string } | null;
}) {
  const isEditMode = Boolean(editingYear?.id);

  const [yearName, setYearName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingYear) {
      setYearName(editingYear.year_name);
      setIsActive(editingYear.status === "active");
    } else {
      setYearName("");
      setIsActive(true);
    }
  }, [editingYear]);

  const handleSave = async () => {
    if (!yearName.trim()) {
      alert("Enter academic year");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && editingYear) {
        await updateAcademicYear(
          editingYear.id,
          yearName,
          isActive ? "active" : "inactive"
        );
        alert("✅ Academic year updated");
      } else {
        await createAcademicYear(yearName);
        alert("✅ Academic year created");
      }

      setYearName("");
      onBack();
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h2 className="text-lg font-semibold mb-4">
        {isEditMode ? "Edit Academic Year" : "Create Academic Year"}
      </h2>

      <div className="bg-white rounded-2xl shadow p-5 max-w-md">
        <label className="block text-sm font-medium mb-1">Academic Year</label>

        <input
          type="text"
          value={yearName}
          onChange={(e) => setYearName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4 outline-none"
          placeholder="2025-2026"
        />

        {isEditMode && (
          <>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Status</label>

              <button
                type="button"
                onClick={() => setIsActive((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  isActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              {isActive ? "Active" : "Inactive"}
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {loading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update"
            : "Create"}
        </button>
      </div>
    </div>
  );
}
